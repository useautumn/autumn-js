"use client";
import { Button } from "./components/ui/button";
import { useCustomer } from "autumn-js/react";
import AttachDialog from "./components/autumn/attach-dialog";
// import PricingTable from "@/components/autumn/pricing-table";

export default function Home() {
  const {
    customer,
    attach,
    check,
    track,
    cancel,
    openBillingPortal,
    redeemReferralCode,
    createReferralCode,
    allowed,
  } = useCustomer();

  return (
    <div className="min-h-screen bg-gradient-to-b p-10">
      <main className="max-w-4xl mx-auto space-y-8">
        {/* <PricingTable /> */}
        <section className="space-y-4">
          <div className="flex gap-3">

          </div>
          <p>
            Credits allowed: {allowed({ featureId: "messages" }) ? "Yes" : "No"}
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-md font-semibold text-slate-800">Customer</h2>
          <pre className="whitespace-pre-wrap text-blue-400 mt-4 text-xs">
            {JSON.stringify(customer, null, 4)}
          </pre>
        </section>

        <div className="flex justify-start items-center gap-2">
          <Button
            onClick={async () => {
              const res = await openBillingPortal({
                // openInNewTab: true,
                returnUrl: "https://facebook.com",
              });
              console.log(res);
            }}
          >
            Open Billing Portal
          </Button>

          <Button
            onClick={async () => {
              const res = await cancel({
                productId: "pro",
              });
              console.log(res);
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={async () => {
              const res = await check({
                featureId: "messages",
              });
              console.log(res);
            }}
          >
            Check
          </Button>

          <Button
            onClick={async () => {
              const res = await track({
                featureId: "messages",
              });
              console.log(res);
            }}
          >
            Track
          </Button>

          <Button
            onClick={async () => {
              const res = await attach({
                productId: "pro",
                openInNewTab: true,
                dialog: AttachDialog,
              });
              console.log(res);
            }}
          >
            Attach
          </Button>

          <Button
            onClick={async () => {
              console.log(
                "Allowed:",
                allowed({
                  featureId: "messages",
                })
              );
            }}
          >
            Allowed
          </Button>
          <Button
            onClick={async () => {
              const res = await createReferralCode({
                programId: "best",
              });
              console.log(res);
            }}
          >
            Create Referral Code
          </Button>

          <Button
            onClick={async () => {
              const res = await redeemReferralCode({
                code: "NFZIG2",
              });
              console.log(res);
            }}
          >
            Redeem Referral Code
          </Button>
        </div>
      </main>
    </div>
  );
}
