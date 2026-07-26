const VARIANT_CLASS = {
  coral: "btn-coral",
  teal: "btn-teal",
  yellow: "btn-yellow",
  red: "btn-red",
  white: "btn-white",
  outline: "btn-outline",
};

export default function Button({
  children,
  variant = "coral",
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
