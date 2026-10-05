import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-[100px] w-full resize-y rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 transition-colors placeholder:text-stone-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100",
            error && "border-red-500",
            className,
          )}
          {...props}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
