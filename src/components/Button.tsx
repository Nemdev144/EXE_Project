interface ButtonProps {
  children: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`button button--${variant} ${className}`}
    >
      {children}
    </button>
  );
}
