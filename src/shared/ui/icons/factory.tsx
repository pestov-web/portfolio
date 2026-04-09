import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type IconProps = Omit<ComponentPropsWithoutRef<"svg">, "children"> & {
  size?: number;
};

export type GlyphIconProps = ComponentPropsWithoutRef<"span"> & {
  size?: number;
};

type CreateIconOptions = {
  viewBox: string;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeLinecap?: "butt" | "round" | "square" | "inherit";
  strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
  children: ReactNode;
};

export function createIcon({
  viewBox,
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  strokeLinecap,
  strokeLinejoin,
  children,
}: CreateIconOptions) {
  return function Icon({ size, ...props }: IconProps) {
    return (
      <svg
        width={size ?? width}
        height={size ?? height}
        viewBox={viewBox}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        aria-hidden
        {...props}
      >
        {children}
      </svg>
    );
  };
}

export function createGlyphIcon(glyph: ReactNode, className?: string) {
  return function GlyphIcon({ size, className: extraClassName, ...props }: GlyphIconProps) {
    return (
      <span
        aria-hidden
        className={["inline-flex items-center justify-center leading-none", className, extraClassName]
          .filter(Boolean)
          .join(" ")}
        style={size ? { fontSize: `${size}px` } : undefined}
        {...props}
      >
        {glyph}
      </span>
    );
  };
}