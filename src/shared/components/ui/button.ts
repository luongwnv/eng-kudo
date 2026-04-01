import { h } from "@/core/render/render";
import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "action";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonOptions {
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  borderBottom?: number;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-light",
  secondary: "bg-card text-main hover:bg-border/40",
  ghost: "bg-transparent text-secondary hover:bg-card hover:text-main",
  danger: "bg-error text-white hover:brightness-110",
  action: "bg-card text-secondary border-b-4 border-secondary-accent hover:text-main btn-3d",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
  xl: "px-8 py-4 text-lg rounded-2xl",
};

export function Button(options: ButtonOptions): HTMLButtonElement {
  const {
    text,
    variant = "primary",
    size = "md",
    className,
    disabled,
    borderBottom,
    onClick,
  } = options;

  const bbStyle = borderBottom != null ? `border-bottom-width: ${borderBottom}px` : "";

  const el = h(
    "button",
    {
      class: cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out cursor-pointer select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ),
      ...(bbStyle ? { style: bbStyle } : {}),
      ...(disabled ? { disabled: true } : {}),
    },
    text,
  ) as HTMLButtonElement;

  if (onClick) {
    el.addEventListener("click", onClick);
  }

  return el;
}
