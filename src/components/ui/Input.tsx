"use client";

import { clsx } from "clsx";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
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
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-kith-muted pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full rounded-input border border-kith-gray-light bg-white py-3 font-body text-base text-kith-text placeholder:text-kith-muted",
              icon ? "pl-10 pr-4" : "px-4",
              "focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange",
              "transition-all duration-200",
              error &&
                "border-red-400 focus:ring-red-300/30 focus:border-red-400",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 font-body">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
