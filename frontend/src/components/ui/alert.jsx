import * as React from "react";
import { cn } from "@/lib/utils";

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
	<div
		ref={ref}
		role="alert"
		className={cn(
			"w-full rounded-2xl border p-4 text-sm",
			variant === "destructive"
				? "border-destructive/40 bg-destructive/10 text-destructive"
				: "border-border/60 bg-background/80 text-foreground",
			className
		)}
		{...props}
	/>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
	<h5 ref={ref} className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("text-sm leading-relaxed text-muted-foreground", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

