import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={textareaId}
          className="text-sm font-semibold text-text-primary"
        >
          {label}
        </label>
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[120px] w-full rounded-md border bg-bg-surface px-3 py-2 text-sm text-text-primary ring-offset-bg-page placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error ? "border-red-500 focus-visible:ring-red-500" : "border-border",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? errorId : (hint ? hintId : undefined)
          }
          ref={ref}
          {...props}
        />
        {error ? (
          <span
            id={errorId}
            className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1"
            role="alert"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </span>
        ) : hint ? (
          <span
            id={hintId}
            className="text-xs text-text-muted mt-1"
          >
            {hint}
          </span>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
