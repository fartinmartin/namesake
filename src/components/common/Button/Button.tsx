import type { FieldSize } from "@/components/common";
import { focusRing } from "@/components/utils";
import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface ButtonProps extends AriaButtonProps {
  children?: React.ReactNode;
  label?: string;
  icon?: LucideIcon;
  iconProps?: LucideProps;
  endIcon?: LucideIcon;
  endIconProps?: LucideProps;
  variant?: "primary" | "secondary" | "destructive" | "icon" | "ghost";
  size?: FieldSize;
}

export const buttonStyles = tv({
  extend: focusRing,
  base: "py-2 text-sm font-medium whitespace-nowrap rounded-lg flex gap-1.5 items-center justify-center border border-gray-dim transition",
  variants: {
    variant: {
      primary:
        "bg-purple-solid text-white border-purple-10 dark:border-purpledark-10 shadow-sm",
      secondary:
        "bg-white dark:bg-graydark-3 hover:bg-white dark:hover:bg-graydark-4 hover:border-gray-7 dark:hover:border-graydark-7 text-gray-normal shadow-sm",
      destructive: "bg-red-solid",
      icon: "bg-transparent hover:bg-graya-3 dark:hover:bg-graydarka-3 text-gray-dim hover:text-gray-normal border-0 flex shrink-0 items-center justify-center rounded-full",
      ghost:
        "bg-transparent hover:bg-graya-3 dark:hover:bg-graydarka-3 text-gray-dim hover:text-gray-normal border-0",
    },
    size: {
      small: "h-8 px-2",
      medium: "h-10 px-3",
      large: "h-12 px-3.5 text-lg",
    },
    isDisabled: {
      false: "cursor-pointer",
      true: "cursor-default text-gray-dim opacity-50 forced-colors:text-[GrayText]",
    },
  },
  compoundVariants: [
    {
      variant: "icon",
      size: "small",
      className: "w-8 h-8",
    },
    {
      variant: "icon",
      size: "medium",
      className: "w-10 h-10 p-2",
    },
  ],
  defaultVariants: {
    variant: "secondary",
    size: "medium",
  },
});

export function Button({
  variant,
  size,
  icon: Icon,
  iconProps,
  endIcon: EndIcon,
  endIconProps,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        buttonStyles({
          ...renderProps,
          variant,
          size,
          className,
        }),
      )}
    >
      {Icon && (
        <Icon
          size={size === "large" ? 20 : 16}
          strokeWidth={size === "large" ? 2.5 : 2}
          className="shrink-0"
          {...iconProps}
        />
      )}
      {children}
      {EndIcon && (
        <EndIcon
          size={size === "large" ? 20 : 16}
          strokeWidth={size === "large" ? 2.5 : 2}
          {...endIconProps}
        />
      )}
    </AriaButton>
  );
}
