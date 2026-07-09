import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentHover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, accentHover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-bg-surface border border-border rounded-lg shadow-sm p-6 transition-all duration-200",
          accentHover
            ? "hover:shadow-md hover:border-accent/40 [&:hover]:[box-shadow:inset_4px_0_0_0_var(--color-accent),0_4px_6px_-1px_rgb(0_0_0/0.1)]"
            : "hover:shadow-md",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
