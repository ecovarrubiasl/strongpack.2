import * as React from "react";

type ToggleProps = {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  className?: string;
  children?: React.ReactNode;
};

export function Toggle({ pressed = false, onPressedChange, className = "", children }: ToggleProps) {
  return (
    <button
      onClick={() => onPressedChange && onPressedChange(!pressed)}
      className={`rounded-full border px-3 py-1 text-sm ${pressed ? "bg-slate-900 text-white" : "bg-white text-slate-900"} ${className}`}
      aria-pressed={pressed}
      type="button"
    >
      {children}
    </button>
  );
}

