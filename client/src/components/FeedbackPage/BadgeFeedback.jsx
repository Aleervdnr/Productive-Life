const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };
  
  const BadgeFeedback = ({ children, variant = "default", className = "" }) => {
    return (
      <span
        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${variants[variant]} ${className}`}
      >
        {children}
      </span>
    );
  };
  
  export default BadgeFeedback;
  