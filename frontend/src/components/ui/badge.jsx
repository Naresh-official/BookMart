/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary/10 text-primary",
				secondary: "border-transparent bg-secondary text-secondary-foreground",
				outline: "text-muted-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
	<span
		ref={ref}
		className={cn(badgeVariants({ variant }), className)}
		{...props}
	/>
));
Badge.displayName = "Badge";

export { Badge, badgeVariants };

