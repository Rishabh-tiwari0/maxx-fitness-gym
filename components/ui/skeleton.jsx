import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-secondary/60", className)}
      {...props}
    />
  );
}

export { Skeleton };
