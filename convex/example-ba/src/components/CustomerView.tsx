import { Customer } from "autumn-js";
interface CustomerViewProps {
  customer: Customer;
}

export function CustomerView({ customer }: CustomerViewProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg px-4 py-3 mb-4 w-full max-w-md">
      <div className="font-medium text-gray-100 mb-2 text-sm">
        Signed in as:{" "}
        <span className="text-blue-400 font-semibold">
          {customer.name ?? "No name"}
        </span>
      </div>
      <details className="group">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
          View customer data
        </summary>
        <pre className="text-xs text-gray-300 bg-black/20 rounded p-2 overflow-auto mt-2 border border-gray-700 max-h-40">
          {JSON.stringify(customer ?? {}, null, 2)}
        </pre>
      </details>
    </div>
  );
}
