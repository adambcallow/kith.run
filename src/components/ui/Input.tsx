"use client";

import { clsx } from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-body font-medium text-kith-text"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-input border border-kith-gray-light bg-white px-4 py-3 font-body text-sm text-kith-text placeholder:text-kith-muted",
            "focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange",
            "transition-colors",
            error && "border-red-400 focus:ring-red-300/30 focus:border-red-400",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 font-body">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
