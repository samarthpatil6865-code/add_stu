import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  type: "card" | "table" | "profile";
  count?: number;
}

const SkeletonLoader = ({ type, count = 1 }: SkeletonLoaderProps) => {
  const items = Array.from({ length: count });

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted skeleton-pulse" />
              <div className="w-20 h-6 bg-muted rounded-md skeleton-pulse" />
            </div>
            <div className="w-32 h-6 bg-muted rounded skeleton-pulse mb-2" />
            <div className="w-48 h-4 bg-muted rounded skeleton-pulse mb-4" />
            <div className="w-full h-10 bg-muted rounded-lg skeleton-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-4 border-b">
          <div className="w-48 h-6 bg-muted rounded skeleton-pulse" />
        </div>
        <div className="divide-y">
          {items.map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted skeleton-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-muted rounded skeleton-pulse" />
                <div className="w-24 h-3 bg-muted rounded skeleton-pulse" />
              </div>
              <div className="w-16 h-6 bg-muted rounded skeleton-pulse" />
              <div className="w-24 h-8 bg-muted rounded skeleton-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "profile") {
    return (
      <div className="bg-card rounded-xl p-8 shadow-card max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full bg-muted skeleton-pulse mb-4" />
          <div className="w-48 h-8 bg-muted rounded skeleton-pulse mb-2" />
          <div className="w-32 h-4 bg-muted rounded skeleton-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 bg-secondary rounded-lg">
              <div className="w-16 h-3 bg-muted rounded skeleton-pulse mb-2" />
              <div className="w-24 h-5 bg-muted rounded skeleton-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
