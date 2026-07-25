const VARIANT_CLASS = {
  green: "btn-green",
  blue: "btn-blue",
  red: "btn-red",
  white: "btn-white",
  outline: "btn-outline",
};

export default function Button({
  children,
  variant = "green",
  className = "",
  state, // "selected" | "correct" | "wrong"
  ...props
}) {
  const stateClass = state ? state : "";
  return (
    <button
      className={`btn-3d ${VARIANT_CLASS[variant]} ${stateClass} rounded-2xl font-extrabold py-3.5 px-6 text-sm sm:text-base ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
