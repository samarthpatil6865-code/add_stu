import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon, Eye } from "lucide-react";
import Layout from "@/components/Layout";
import EmptyState from "@/components/EmptyState";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudents } from "@/contexts/StudentContext";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const { students } = useStudents();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return students.filter(
      s => s.name.toLowerCase().includes(lowerQuery) || s.rollNo.toLowerCase().includes(lowerQuery)
    );
  }, [query, students]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleViewStudent = (id: string) => {
    navigate(`/students/${id}`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Search Students
          </h1>
          <p className="text-muted-foreground mt-1">
            Find students by name or roll number
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Type a name or roll number to search..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-14 text-lg bg-card border-border"
            autoFocus
          />
        </div>

        {/* Results */}
        {query.trim() === "" ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start Searching
            </h3>
            <p className="text-muted-foreground">
              Enter a student name or roll number to find them
            </p>
          </div>
        ) : isLoading ? (
          <SkeletonLoader type="table" count={3} />
        ) : results.length === 0 ? (
          <EmptyState 
            type="search" 
            message={`No students found matching "${query}"`}
          />
        ) : (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((student, index) => (
              <div
                key={student.id}
                className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 flex items-center justify-between gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-primary">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Roll No: {student.rollNo} • Class {student.class} • Section {student.section}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewStudent(student.id)}
                  className="flex-shrink-0"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
