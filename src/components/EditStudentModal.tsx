import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudents } from "@/contexts/StudentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Student } from "@/data/students";

const studentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Student name is required")
    .max(100, "Name must be less than 100 characters"),
  rollNo: z
    .string()
    .trim()
    .min(1, "Roll number is required")
    .max(20, "Roll number must be less than 20 characters"),
  class: z.string().min(1, "Class is required"),
  section: z
    .string()
    .trim()
    .min(1, "Section is required")
    .max(10, "Section must be less than 10 characters"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  address: z
    .string()
    .trim()
    .max(200, "Address must be less than 200 characters")
    .optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface EditStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
}

const EditStudentModal = ({ open, onOpenChange, student }: EditStudentModalProps) => {
  const { updateStudent, classes, students } = useStudents();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uniqueClasses = [...new Set(classes.map(c => c.name))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student.name,
      rollNo: student.rollNo,
      class: student.class,
      section: student.section,
      gender: student.gender,
      address: student.address || "",
    },
  });

  const selectedClass = watch("class");
  const selectedGender = watch("gender");

  const onSubmit = (data: StudentFormData) => {
    // Check if roll number already exists in the same class (excluding current student)
    const exists = students.some(
      s => s.id !== student.id && s.rollNo === data.rollNo && s.class === data.class
    );
    if (exists) {
      toast({
        title: "Duplicate roll number",
        description: `Roll number ${data.rollNo} already exists in Class ${data.class}.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      updateStudent(student.id, {
        name: data.name,
        rollNo: data.rollNo,
        class: data.class,
        section: data.section,
        gender: data.gender,
        address: data.address || "",
      });

      toast({
        title: "Student updated successfully!",
        description: `${data.name}'s information has been updated.`,
      });

      setIsSubmitting(false);
      onOpenChange(false);
    }, 300);
  };

  const handleClose = () => {
    reset({
      name: student.name,
      rollNo: student.rollNo,
      class: student.class,
      section: student.section,
      gender: student.gender,
      address: student.address || "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Student</DialogTitle>
          <DialogDescription>
            Update student information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Student Name *</Label>
              <Input
                id="name"
                placeholder="Enter student name"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNo">Roll Number *</Label>
              <Input
                id="rollNo"
                placeholder="e.g., 101"
                {...register("rollNo")}
                className={errors.rollNo ? "border-destructive" : ""}
              />
              {errors.rollNo && (
                <p className="text-sm text-destructive">{errors.rollNo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Class *</Label>
              <Select
                value={selectedClass}
                onValueChange={(value) => setValue("class", value)}
              >
                <SelectTrigger className={errors.class ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      Class {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class && (
                <p className="text-sm text-destructive">{errors.class.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section *</Label>
              <Input
                id="section"
                placeholder="e.g., A"
                {...register("section")}
                className={errors.section ? "border-destructive" : ""}
              />
              {errors.section && (
                <p className="text-sm text-destructive">{errors.section.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select
                value={selectedGender}
                onValueChange={(value) => setValue("gender", value as "Male" | "Female" | "Other")}
              >
                <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                placeholder="Enter address"
                {...register("address")}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal;
