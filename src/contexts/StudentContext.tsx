import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Student, students as initialStudents, ClassInfo } from "@/data/students";

interface ClassData {
  id: string;
  name: string;
  section?: string;
  description?: string;
}

interface StudentContextType {
  students: Student[];
  classes: ClassData[];
  filteredStudents: Student[];
  searchQuery: string;
  selectedClass: string;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedClass: (classId: string) => void;
  addStudent: (student: Omit<Student, "id">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addClass: (classData: Omit<ClassData, "id">) => void;
  updateClass: (id: string, classData: Partial<ClassData>) => void;
  deleteClass: (id: string) => void;
  getStudentsByClass: (classId: string) => Student[];
  getClassInfo: () => ClassInfo[];
  simulateLoading: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const STUDENTS_STORAGE_KEY = "sms_students";
const CLASSES_STORAGE_KEY = "sms_classes";

const defaultClasses: ClassData[] = [
  { id: "class_1", name: "1", section: "A" },
  { id: "class_2", name: "2", section: "A" },
  { id: "class_3", name: "3", section: "A" },
  { id: "class_4", name: "4", section: "A" },
  { id: "class_5", name: "5", section: "A" },
  { id: "class_6", name: "6", section: "A" },
  { id: "class_7", name: "7", section: "A" },
  { id: "class_8", name: "8", section: "A" },
  { id: "class_9", name: "9", section: "A" },
  { id: "class_10", name: "10", section: "A" },
];

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const stored = localStorage.getItem(STUDENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialStudents;
  });

  const [classes, setClasses] = useState<ClassData[]>(() => {
    const stored = localStorage.getItem(CLASSES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultClasses;
  });

  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
  }, [classes]);

  // Filter students
  useEffect(() => {
    let result = students;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(lowerQuery) || s.rollNo.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedClass !== "all") {
      if (selectedClass === "6-10") {
        result = result.filter(s => parseInt(s.class) >= 6 && parseInt(s.class) <= 10);
      } else {
        result = result.filter(s => s.class === selectedClass);
      }
    }

    setFilteredStudents(result);
  }, [searchQuery, selectedClass, students]);

  const addStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addClass = (classData: Omit<ClassData, "id">) => {
    const newClass: ClassData = {
      ...classData,
      id: `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (id: string, updates: Partial<ClassData>) => {
    setClasses(prev => prev.map(c => {
      if (c.id === id) {
        const oldName = c.name;
        const newClass = { ...c, ...updates };
        // If class name changed, update students in that class
        if (updates.name && updates.name !== oldName) {
          setStudents(prevStudents => 
            prevStudents.map(s => s.class === oldName ? { ...s, class: updates.name! } : s)
          );
        }
        return newClass;
      }
      return c;
    }));
  };

  const deleteClass = (id: string) => {
    const classToDelete = classes.find(c => c.id === id);
    if (classToDelete) {
      // Also delete students in that class
      setStudents(prev => prev.filter(s => s.class !== classToDelete.name));
    }
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const getStudentsByClass = (classId: string): Student[] => {
    if (classId === "6-10") {
      return students.filter(s => parseInt(s.class) >= 6 && parseInt(s.class) <= 10);
    }
    return students.filter(s => s.class === classId);
  };

  const getClassInfo = (): ClassInfo[] => {
    // Get unique class names from the classes array
    const uniqueClasses = [...new Set(classes.map(c => c.name))].sort((a, b) => parseInt(a) - parseInt(b));
    
    return uniqueClasses.map(className => ({
      id: className,
      name: className,
      displayName: `Class ${className}`,
      studentCount: students.filter(s => s.class === className).length,
    }));
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        classes,
        filteredStudents,
        searchQuery,
        selectedClass,
        isLoading,
        setSearchQuery,
        setSelectedClass,
        addStudent,
        updateStudent,
        deleteStudent,
        addClass,
        updateClass,
        deleteClass,
        getStudentsByClass,
        getClassInfo,
        simulateLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};
