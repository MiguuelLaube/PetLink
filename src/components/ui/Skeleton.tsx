import { cn } from './cn';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse-soft rounded-card bg-peach-soft', className)} />;
}

export function PetCardSkeleton() {
  return (
    <div className="rounded-card bg-white/60 p-4">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="mt-4 h-5 w-1/2" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-4 h-9 w-28 rounded-full" />
    </div>
  );
}
