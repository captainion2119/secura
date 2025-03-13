export default function Button({
  children = "Detailed Survey",
  onClick,
  type = "button",
  className = "",
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[#6D31ED] text-white py-2 px-4 rounded-lg transition-all duration-300 ease-in-out 
      hover:bg-[#5113D7] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6D31ED] ${className}`}
    >
      {children}
    </button>
  );
}
