import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Hash, GraduationCap, MapPin, Users, Pencil } from "lucide-react";
import Layout from "@/components/Layout";
import SkeletonLoader from "@/components/SkeletonLoader";
import EditStudentModal from "@/components/EditStudentModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/contexts/StudentContext";
import { toast } from "@/hooks/use-toast";
import { Student } from "@/data/students";

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, deleteStudent } = useStudents();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (id) {
        const found = students.find(s => s.id === id);
        setStudent(found || null);
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id, students]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirmDelete = () => {
    if (student) {
      deleteStudent(student.id);
      toast({
        title: "Student deleted",
        description: `${student.name} has been removed from the system.`,
      });
      navigate("/students");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" className="mb-6" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <SkeletonLoader type="profile" />
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="bg-card rounded-xl p-8 shadow-card text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Student Not Found
            </h2>
            <p className="text-muted-foreground">
              The student you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const profileFields = [
    { label: "Roll Number", value: student.rollNo, icon: Hash },
    { label: "Class", value: `Class ${student.class}`, icon: GraduationCap },
    { label: "Section", value: student.section, icon: Users },
    { label: "Gender", value: student.gender, icon: User },
    { label: "Address", value: student.address || "Not provided", icon: MapPin, fullWidth: true },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>

        <div className="bg-card rounded-xl shadow-card overflow-hidden animate-scale-in">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-info p-8 text-center relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setEditModalOpen(true)}
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <div className="w-28 h-28 rounded-full bg-card flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl font-bold text-primary">
                {student.name.charAt(0)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground mb-1">
              {student.name}
            </h1>
            <p className="text-primary-foreground/80">
              Class {student.class} - Section {student.section}
            </p>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Student Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileFields.map((field) => (
                <div
                  key={field.label}
                  className={`p-4 bg-secondary rounded-lg ${
                    field.fullWidth ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <field.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{field.label}</span>
                  </div>
                  <p className="text-foreground font-medium">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setEditModalOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Student
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditStudentModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        student={student}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Student?"
        description={`Are you sure you want to delete ${student.name}? This action cannot be undone.`}
      />
    </Layout>
  );
};

export default StudentProfile;
