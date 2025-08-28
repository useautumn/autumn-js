export const ProgressBar = ({
  usage,
  includedUsage,
  featureName,
}: {
  usage: number;
  includedUsage: number;
  featureName: string;
}) => {
  const remainingPercentage = Math.max(
    ((includedUsage - usage) / includedUsage) * 100,
    0
  );
  const remaining = Math.max(includedUsage - usage, 0);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-300 mb-2">
        <span>{featureName}</span>
        <span>
          {remaining} remaining of {includedUsage}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${remainingPercentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {usage} used ({remainingPercentage.toFixed(1)}% remaining)
      </div>
    </div>
  );
};