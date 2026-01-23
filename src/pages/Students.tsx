import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import SkeletonLoader from "@/components/SkeletonLoader";
import AddStudentModal from "@/components/AddStudentModal";
import EditStudentModal from "@/components/EditStudentModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStudents } from "@/contexts/StudentContext";
import { toast } from "@/hooks/use-toast";
import { Student } from "@/data/students";

const ITEMS_PER_PAGE = 10;

const Students = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialClass = searchParams.get("class") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { students, classes, deleteStudent } = useStudents();

  const allClasses = [...new Set(classes.map(c => c.name))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedClass]);

  const filteredStudents = useMemo(() => {
    let result = students;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(lowerQuery) ||
          s.rollNo.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedClass !== "all") {
      if (selectedClass === "6-10") {
        result = result.filter(s => parseInt(s.class) >= 6 && parseInt(s.class) <= 10);
      } else {
        result = result.filter(s => s.class === selectedClass);
      }
    }

    return result;
  }, [searchQuery, selectedClass, students]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewStudent = (id: string) => {
    navigate(`/students/${id}`);
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      toast({
        title: "Student deleted",
        description: `${selectedStudent.name} has been removed from the system.`,
      });
      setSelectedStudent(null);
    }
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    if (value === "all") {
      navigate("/students", { replace: true });
    } else {
      navigate(`/students?class=${value}`, { replace: true });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Manage Students
            </h1>
            <p className="text-muted-foreground mt-1">
              {selectedClass !== "all"
                ? `Viewing Class ${selectedClass} students`
                : "View and manage all students"}
            </p>
          </div>
          <Button onClick={() => setAddStudentOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or roll number..."
          />
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground hidden sm:block" />
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Classes</SelectItem>
                {allClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredStudents.length} student
          {filteredStudents.length !== 1 ? "s" : ""}
        </div>

        {/* Students Table */}
        {isLoading ? (
          <SkeletonLoader type="table" count={5} />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            type={searchQuery ? "search" : "students"}
            message={
              searchQuery
                ? `No students found matching "${searchQuery}"`
                : "No students in this class. Add your first student!"
            }
          />
        ) : (
          <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="font-semibold">Roll No</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Class</TableHead>
                    <TableHead className="font-semibold">Section</TableHead>
                    <TableHead className="font-semibold">Gender</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student, index) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-secondary/30 transition-colors animate-slide-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <TableCell className="font-medium">{student.rollNo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.gender === "Male"
                              ? "bg-info/10 text-info"
                              : student.gender === "Female"
                              ? "bg-accent/10 text-accent"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {student.gender}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewStudent(student.id)}
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(student)}
                            className="h-8 w-8 text-warning hover:bg-warning/10"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(student)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStudentModal
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
        defaultClass={selectedClass !== "all" ? selectedClass : undefined}
      />
      {selectedStudent && (
        <EditStudentModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          student={selectedStudent}
        />
      )}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Student?"
        description={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone.`}
      />
    </Layout>
  );
};

export default Students;
