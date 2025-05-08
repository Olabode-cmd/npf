const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    secondary:
      "bg-green-100 hover:bg-green-200 text-green-800 focus:ring-green-400",
    outline:
      "border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost:
      "bg-transparent hover:bg-green-50 text-green-600 focus:ring-green-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
