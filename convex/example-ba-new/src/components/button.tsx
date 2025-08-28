export function Button({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={
        [
          "flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg",
          className
        ].filter(Boolean).join(" ")
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}