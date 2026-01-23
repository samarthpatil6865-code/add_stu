import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Users, ArrowRight, Pencil } from "lucide-react";
import Layout from "@/components/Layout";
import SkeletonLoader from "@/components/SkeletonLoader";
import AddClassModal from "@/components/AddClassModal";
import EditClassModal from "@/components/EditClassModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/contexts/StudentContext";
import { toast } from "@/hooks/use-toast";

interface ClassData {
  id: string;
  name: string;
  section?: string;
  description?: string;
}

const Classes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [addClassOpen, setAddClassOpen] = useState(false);
  const [editClassOpen, setEditClassOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<ClassData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { getClassInfo, deleteClass, classes, getStudentsByClass } = useStudents();
  const classInfo = getClassInfo();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (className: string) => {
    const classData = classes.find(c => c.name === className);
    if (classData) {
      setClassToEdit(classData);
      setEditClassOpen(true);
    }
  };

  const handleDeleteClick = (classId: string) => {
    setClassToDelete(classId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (classToDelete) {
      const classData = classes.find(c => c.name === classToDelete);
      const studentCount = getStudentsByClass(classToDelete).length;
      
      deleteClass(classData?.id || "");
      
      toast({
        title: "Class deleted",
        description: `Class ${classToDelete} and ${studentCount} student(s) have been removed.`,
      });
      
      setClassToDelete(null);
    }
  };

  const handleViewStudents = (className: string) => {
    navigate(`/students?class=${className}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Manage Classes
            </h1>
            <p className="text-muted-foreground mt-1">
              Add, view, and manage your classes.
            </p>
          </div>
          <Button onClick={() => setAddClassOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </div>

        {/* Class Grid */}
        {isLoading ? (
          <SkeletonLoader type="card" count={6} />
        ) : classInfo.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl shadow-card">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Classes Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first class to start organizing students.
            </p>
            <Button onClick={() => setAddClassOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Class
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classInfo.map((cls, index) => {
              const fullClassData = classes.find(c => c.name === cls.name);
              return (
                <div
                  key={cls.id}
                  className="group bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">
                        {cls.studentCount} students
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEditClick(cls.name)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteClick(cls.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {cls.displayName}
                  </h3>

                  {fullClassData?.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {fullClassData.description}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground mb-4">
                    {cls.studentCount === 0
                      ? "No students enrolled yet"
                      : `${cls.studentCount} student${cls.studentCount !== 1 ? "s" : ""} enrolled`}
                  </p>

                  <Button
                    onClick={() => handleViewStudents(cls.name)}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    variant="secondary"
                  >
                    View Students
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddClassModal open={addClassOpen} onOpenChange={setAddClassOpen} />
      <EditClassModal 
        open={editClassOpen} 
        onOpenChange={setEditClassOpen} 
        classData={classToEdit}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Class?"
        description={`Are you sure you want to delete Class ${classToDelete}? All students in this class will also be removed. This action cannot be undone.`}
      />
    </Layout>
  );
};

export default Classes;
