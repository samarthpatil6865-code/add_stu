import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";

const classSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Class name is required")
    .max(50, "Class name must be less than 50 characters"),
  section: z
    .string()
    .trim()
    .max(10, "Section must be less than 10 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

type ClassFormData = z.infer<typeof classSchema>;

interface AddClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddClassModal = ({ open, onOpenChange }: AddClassModalProps) => {
  const { addClass, classes } = useStudents();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      section: "",
      description: "",
    },
  });

  const onSubmit = (data: ClassFormData) => {
    // Check if class already exists
    const exists = classes.some(c => c.name === data.name);
    if (exists) {
      toast({
        title: "Class already exists",
        description: `Class ${data.name} is already in the system.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate async operation
    setTimeout(() => {
      addClass({
        name: data.name,
        section: data.section || "A",
        description: data.description || "",
      });
      
      toast({
        title: "Class added successfully!",
        description: `Class ${data.name} has been added to the system.`,
      });
      
      reset();
      setIsSubmitting(false);
      onOpenChange(false);
    }, 300);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Class</DialogTitle>
          <DialogDescription>
            Create a new class to organize students.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              placeholder="Enter class name"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Section (Optional)</Label>
            <Input
              id="section"
              placeholder="e.g., A, B, C"
              {...register("section")}
              className={errors.section ? "border-destructive" : ""}
            />
            {errors.section && (
              <p className="text-sm text-destructive">{errors.section.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Brief description of the class"
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
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
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Class"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
