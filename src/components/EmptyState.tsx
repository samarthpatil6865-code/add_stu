import { Search, UserX } from "lucide-react";

interface EmptyStateProps {
  type?: "search" | "students";
  message?: string;
}

const EmptyState = ({ type = "students", message }: EmptyStateProps) => {
  const Icon = type === "search" ? Search : UserX;
  const defaultMessage = type === "search" 
    ? "No students found matching your search" 
    : "No students available";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {type === "search" ? "No Results Found" : "No Students"}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {message || defaultMessage}
      </p>
    </div>
  );
};

export default EmptyState;
