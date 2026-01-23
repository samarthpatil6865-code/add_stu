import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: "default" | "primary" | "success" | "info";
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  info: "bg-info text-info-foreground",
};

const StatCard = ({ title, value, icon, variant = "default" }: StatCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl p-6 shadow-card transition-all duration-300 hover:shadow-card-hover animate-fade-in",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium",
            variant === "default" ? "text-muted-foreground" : "opacity-80"
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          variant === "default" ? "bg-primary/10 text-primary" : "bg-white/20"
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
