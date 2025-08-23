"use client";

import { useCustomer, useEntity } from "autumn-js/react";
import { api } from "../../convex/_generated/api";
import { ProgressBar } from "./ProgressBar";
import { CustomerView } from "./CustomerView";
import React, { useState } from "react";
import { Button } from "./button";
import { CheckoutDialog } from "autumn-js/react";
import { useAction } from "convex/react";

export function ConvexCustomerSection() {
  const [open, setOpen] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  // const foo = useAction(api.autumn.foo);
  // const { customer, track, check, attach, checkout, createEntity, deleteEntity } =
  //   useCustomer({
  //     autumnApi: (api as any).autumn,
  //   });
  const { customer, track, check, attach, checkout, createEntity } = useCustomer();
  const entityApi = useEntity("test");
  const billingPortal = useAction(api.example.billingPortal);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl p-8 w-full">
      <h3 className="text-center text-lg font-semibold text-gray-200 mb-6">
        Try it out
      </h3>
      {/* <CheckoutDialog open={open} setOpen={setOpen} checkoutResult={checkoutResult} /> */}
      {customer && customer.features && customer.features.messages && (
        <ProgressBar
          usage={customer.features.messages.usage ?? 0}
          includedUsage={customer.features.messages.included_usage ?? 0}
          featureName={customer.features.messages.name}
        />
      )}
      {customer && <CustomerView customer={customer} />}
      <div className="gap-4 mt-8 grid grid-cols-2 grid-rows-2">
        <Button
          onClick={async () => {
            let res = await track({
              featureId: "messages",
            });
            // let res = await foo({});
            (window as any).debugLog?.(
              `Convex track result: ${JSON.stringify(res, null, 4)}`
            );
          }}
        >
          Track
        </Button>
        <Button
          onClick={async () => {
            let res = await check({
              featureId: "messages",
            });
            (window as any).debugLog?.(
              `Convex check result: ${JSON.stringify(res, null, 4)}`
            );
          }}
        >
          Check
        </Button>

        <Button
          onClick={async () => {
            let res = await attach({
              productId: "pro",
              successUrl: "http://localhost:5173/",
              dialog: CheckoutDialog,
            });

            (window as any).debugLog?.(
              `Convex attach result: ${JSON.stringify(res, null, 4)}`
            );
          }}
        >
          Attach
        </Button>

        <Button
          onClick={async () => {
            let res = await checkout({
              productId: "prepaid",
              successUrl: "http://localhost:5173/",
              // dialog: {
              //   open: open,
              //   setOpen: setOpen,
              //   setProps: (props: any) => {
              //     setCheckoutResult(props.checkoutResult);
              //   },
              // }
              dialog: CheckoutDialog,
              // dialog: <CheckoutDialog open={open} setOpen={setOpen} checkoutResult={checkoutResult} />
            });

            (window as any).debugLog?.(
              `Convex checkout result: ${JSON.stringify(res, null, 4)}`
            );
          }}
        >
          Checkout
        </Button>

        <Button
          className="col-span-2"
          onClick={async () => {
            let res = await createEntity({
              name: "test",
              id: "test",
              featureId: "seats",
            });

            (window as any).debugLog?.(
              `Convex create entity result: ${JSON.stringify(res, null, 4)}`
            );
          }}
        >
          Create Entity
        </Button>

        <Button 
          className="col-span-2"
          onClick={async () => {
            let res = await billingPortal();
            (window as any).debugLog?.(
              `Convex billing portal result: ${JSON.stringify(res, null, 4)}`
            );
          }}
        >
          Billing Portal
        </Button>

        {/* <Button
          className="col-span-2"
          onClick={async () => {
            let res = await entityApi.delete();

            (window as any).debugLog?.(
              `Convex delete entity result: ${JSON.stringify(res, null, 4)}`
            );
          }}
        >
          Delete Entity
        </Button> */}
      </div>
    </div>
  );
}