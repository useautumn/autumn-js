import { useCustomer } from "autumn-js/react";
import { CustomerView } from "./CustomerView";
import { ProgressBar } from "./ProgressBar";

export function AutumnJSCustomerSection() {
  const { customer, check, track, checkout, attach } = useCustomer();

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl p-8 w-full">
      <h3 className="text-center text-lg font-semibold text-gray-200 mb-6">
        Try it out
      </h3>
      {customer && customer.features && customer.features.messages && (
        <ProgressBar
          usage={customer.features.messages.usage ?? 0}
          includedUsage={customer.features.messages.included_usage ?? 0}
          featureName={customer.features.messages.name}
        />
      )}
      {customer && <CustomerView customer={customer} />}
      <div className="gap-4 mt-8 grid grid-cols-2 grid-rows-2">
        <button
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg"
          onClick={async () => {
            (window as any).debugLog?.("Track button clicked");
            let res = await track({
              featureId: "messages",
            });
            (window as any).debugLog?.(`Track result: ${JSON.stringify(res, null, 4)}`);
          }}
        >
          Track
        </button>
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg"
          onClick={async () => {
            (window as any).debugLog?.("Check button clicked");
            let res = await check({
              featureId: "messages",
            });
            (window as any).debugLog?.(`Check result: ${JSON.stringify(res, null, 4)}`);
          }}
        >
          Check
        </button>

        <button
          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg"
          onClick={async () => {
            let res = await attach({
              productId: "pro",
              successUrl: "http://localhost:5173/",
            });

            (window as any).debugLog?.(
              `Convex attach result: ${JSON.stringify(res, null, 4)}`
            );
          }}
        >
          Attach
        </button>

        <button
          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg"
          onClick={async () => {
            let res = await checkout({
              productId: "prepaid",
              successUrl: "http://localhost:5173/",
            });

            (window as any).debugLog?.(
              `Convex checkout result: ${JSON.stringify(res, null, 4)}`
            );
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}