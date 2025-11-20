import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
	<textarea
		ref={ref}
		className={cn(
			"flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60",
			className
		)}
		{...props}
	/>
));
Textarea.displayName = "Textarea";

export { Textarea };

