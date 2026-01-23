import { useNavigate } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassInfo } from "@/data/students";

interface ClassCardProps {
  classInfo: ClassInfo;
  index: number;
}

const ClassCard = ({ classInfo, index }: ClassCardProps) => {
  const navigate = useNavigate();

  const handleViewStudents = () => {
    navigate(`/students?class=${classInfo.name}`);
  };

  return (
    <div
      className="group bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">
          {classInfo.studentCount} students
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {classInfo.displayName}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        {classInfo.name === "6-10" 
          ? "Senior secondary students" 
          : `Primary ${classInfo.name} students`}
      </p>
      
      <Button 
        onClick={handleViewStudents}
        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
        variant="secondary"
      >
        View Students
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

export default ClassCard;
