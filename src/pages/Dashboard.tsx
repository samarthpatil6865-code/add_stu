import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Search, Plus } from "lucide-react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import StatCard from "@/components/StatCard";
import ClassCard from "@/components/ClassCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import AddClassModal from "@/components/AddClassModal";
import AddStudentModal from "@/components/AddStudentModal";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/contexts/StudentContext";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [addClassOpen, setAddClassOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();
  const { students, getClassInfo } = useStudents();
  const classInfo = getClassInfo();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    
    // Set personalized greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning! ☀️ Ready to inspire young minds today?");
    } else if (hour < 17) {
      setGreeting("Good afternoon! 🌤️ Let's continue the learning journey!");
    } else {
      setGreeting("Good evening! 🌙 Time to wrap up today's achievements!");
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const totalStudents = students.length;
  const totalClasses = classInfo.length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent animate-fade-in">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 animate-slide-up">
              {greeting || "Welcome back! Here's what's happening in your classes today."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search students..."
            />
            <div className="flex gap-2">
              <Button onClick={() => setAddClassOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
              <Button onClick={() => setAddStudentOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Amazing Students"
            value={totalStudents}
            icon={<Users className="w-6 h-6" />}
            variant="primary"
          />
          <StatCard
            title="Active Classes"
            value={totalClasses}
            icon={<GraduationCap className="w-6 h-6" />}
            variant="success"
          />
          <StatCard
            title="Quick Search"
            value="Ready"
            icon={<Search className="w-6 h-6" />}
            variant="info"
          />
        </div>

        {/* Class Blocks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Class Overview
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/classes")}
              className="text-primary"
            >
              View All Classes
            </Button>
          </div>
          {isLoading ? (
            <SkeletonLoader type="card" count={6} />
          ) : classInfo.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl shadow-card animate-fade-in">
              <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Start Your Journey?</h3>
              <p className="text-muted-foreground mb-4">Every great classroom begins with a single class. Let's create yours!</p>
              <Button onClick={() => setAddClassOpen(true)} className="animate-pulse">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Class
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classInfo.map((cls, index) => (
                <ClassCard key={cls.id} classInfo={cls} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddClassModal open={addClassOpen} onOpenChange={setAddClassOpen} />
      <AddStudentModal open={addStudentOpen} onOpenChange={setAddStudentOpen} />
    </Layout>
  );
};

export default Dashboard;
