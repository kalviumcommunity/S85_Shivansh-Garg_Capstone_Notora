export function Button({ children, variant = "solid", className = "", ...props }) {
    const base = "px-8 py-3 font-semibold rounded-2xl shadow-2xl transition-all duration-300";
    const styles =
      variant === "outline"
        ? `border-2 border-[#9AC9DE] text-[#9AC9DE] hover:bg-[#1E3A47] hover:border-[#78B2CC] ${className}`
        : `bg-gradient-to-r from-[#6DD5FA] to-[#2980B9] text-white hover:from-[#2980B9] hover:to-[#1B4F72] ${className}`;
    return (
      <button className={`${base} ${styles}`} {...props}>
        {children}
      </button>
    );
  }