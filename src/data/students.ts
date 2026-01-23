export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  photo?: string;
  dateOfBirth?: string;
  parentName?: string;
  contactNumber?: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  displayName: string;
  studentCount: number;
}

export const students: Student[] = [
  // Class 1
  { id: "1", name: "Aarav Sharma", rollNo: "101", class: "1", section: "A", gender: "Male", address: "123 Oak Street, Springfield" },
  { id: "2", name: "Priya Patel", rollNo: "102", class: "1", section: "A", gender: "Female", address: "456 Maple Avenue, Riverside" },
  { id: "3", name: "Arjun Kumar", rollNo: "103", class: "1", section: "B", gender: "Male", address: "789 Pine Road, Lakeside" },
  { id: "4", name: "Ananya Singh", rollNo: "104", class: "1", section: "B", gender: "Female", address: "321 Cedar Lane, Hillview" },
  { id: "5", name: "Vihaan Gupta", rollNo: "105", class: "1", section: "A", gender: "Male", address: "654 Birch Street, Parkside" },
  
  // Class 2
  { id: "6", name: "Diya Reddy", rollNo: "201", class: "2", section: "A", gender: "Female", address: "987 Elm Drive, Meadowbrook" },
  { id: "7", name: "Aditya Joshi", rollNo: "202", class: "2", section: "A", gender: "Male", address: "147 Willow Way, Sunnyvale" },
  { id: "8", name: "Ishita Verma", rollNo: "203", class: "2", section: "B", gender: "Female", address: "258 Spruce Court, Greenfield" },
  { id: "9", name: "Kabir Mehta", rollNo: "204", class: "2", section: "A", gender: "Male", address: "369 Ash Boulevard, Westside" },
  { id: "10", name: "Myra Shah", rollNo: "205", class: "2", section: "B", gender: "Female", address: "741 Poplar Place, Eastview" },
  
  // Class 3
  { id: "11", name: "Reyansh Nair", rollNo: "301", class: "3", section: "A", gender: "Male", address: "852 Cherry Lane, Northfield" },
  { id: "12", name: "Saanvi Iyer", rollNo: "302", class: "3", section: "A", gender: "Female", address: "963 Walnut Street, Southgate" },
  { id: "13", name: "Arnav Desai", rollNo: "303", class: "3", section: "B", gender: "Male", address: "159 Hickory Drive, Oakdale" },
  { id: "14", name: "Kiara Kapoor", rollNo: "304", class: "3", section: "A", gender: "Female", address: "267 Sycamore Road, Pinewood" },
  { id: "15", name: "Vivaan Rao", rollNo: "305", class: "3", section: "B", gender: "Male", address: "378 Magnolia Ave, Cedarville" },
  { id: "16", name: "Anika Bose", rollNo: "306", class: "3", section: "A", gender: "Female", address: "489 Cypress Court, Elmwood" },
  
  // Class 4
  { id: "17", name: "Dhruv Malhotra", rollNo: "401", class: "4", section: "A", gender: "Male", address: "591 Redwood Lane, Willowdale" },
  { id: "18", name: "Avni Saxena", rollNo: "402", class: "4", section: "B", gender: "Female", address: "612 Palm Street, Birchwood" },
  { id: "19", name: "Sai Chandra", rollNo: "403", class: "4", section: "A", gender: "Male", address: "723 Juniper Way, Maplewood" },
  { id: "20", name: "Navya Agarwal", rollNo: "404", class: "4", section: "B", gender: "Female", address: "834 Fir Avenue, Ashland" },
  { id: "21", name: "Yash Pillai", rollNo: "405", class: "4", section: "A", gender: "Male", address: "945 Beech Road, Poplarville" },
  
  // Class 5
  { id: "22", name: "Tara Menon", rollNo: "501", class: "5", section: "A", gender: "Female", address: "156 Chestnut Drive, Spruceton" },
  { id: "23", name: "Advait Shetty", rollNo: "502", class: "5", section: "A", gender: "Male", address: "267 Linden Lane, Hickory Hills" },
  { id: "24", name: "Riya Banerjee", rollNo: "503", class: "5", section: "B", gender: "Female", address: "378 Hazel Street, Sycamore" },
  { id: "25", name: "Karthik Nambiar", rollNo: "504", class: "5", section: "A", gender: "Male", address: "489 Olive Court, Magnolia" },
  { id: "26", name: "Meera Das", rollNo: "505", class: "5", section: "B", gender: "Female", address: "591 Locust Avenue, Cypress" },
  { id: "27", name: "Rohan Chatterjee", rollNo: "506", class: "5", section: "A", gender: "Male", address: "612 Alder Road, Redwood City" },
  
  // Class 6
  { id: "28", name: "Shreya Kulkarni", rollNo: "601", class: "6", section: "A", gender: "Female", address: "723 Dogwood Way, Palmdale" },
  { id: "29", name: "Tanish Hegde", rollNo: "602", class: "6", section: "B", gender: "Male", address: "834 Hemlock Lane, Juniper" },
  { id: "30", name: "Aisha Khan", rollNo: "603", class: "6", section: "A", gender: "Female", address: "945 Laurel Street, Firwood" },
  { id: "31", name: "Dev Murthy", rollNo: "604", class: "6", section: "B", gender: "Male", address: "156 Ivy Drive, Beechmont" },
  
  // Class 7
  { id: "32", name: "Nisha Pandey", rollNo: "701", class: "7", section: "A", gender: "Female", address: "267 Holly Avenue, Chestnut Hill" },
  { id: "33", name: "Harsh Goyal", rollNo: "702", class: "7", section: "A", gender: "Male", address: "378 Boxwood Road, Linden" },
  { id: "34", name: "Pooja Tiwari", rollNo: "703", class: "7", section: "B", gender: "Female", address: "489 Rosewood Court, Hazelton" },
  { id: "35", name: "Manav Bhatt", rollNo: "704", class: "7", section: "A", gender: "Male", address: "591 Mulberry Lane, Olive Grove" },
  { id: "36", name: "Kavya Venkat", rollNo: "705", class: "7", section: "B", gender: "Female", address: "612 Sassafras Street, Locust Valley" },
  
  // Class 8
  { id: "37", name: "Rahul Srinivasan", rollNo: "801", class: "8", section: "A", gender: "Male", address: "723 Aspen Way, Alder Heights" },
  { id: "38", name: "Sneha Raghavan", rollNo: "802", class: "8", section: "A", gender: "Female", address: "834 Cottonwood Drive, Dogwood Park" },
  { id: "39", name: "Akash Sundaram", rollNo: "803", class: "8", section: "B", gender: "Male", address: "945 Catalpa Lane, Hemlock" },
  { id: "40", name: "Divya Krishnan", rollNo: "804", class: "8", section: "A", gender: "Female", address: "156 Ginkgo Avenue, Laurel Springs" },
  
  // Class 9
  { id: "41", name: "Varun Ramesh", rollNo: "901", class: "9", section: "A", gender: "Male", address: "267 Sequoia Road, Ivy Lane" },
  { id: "42", name: "Simran Bajaj", rollNo: "902", class: "9", section: "B", gender: "Female", address: "378 Banyan Street, Holly" },
  { id: "43", name: "Nikhil Prasad", rollNo: "903", class: "9", section: "A", gender: "Male", address: "489 Bamboo Court, Boxwood" },
  { id: "44", name: "Lakshmi Suresh", rollNo: "904", class: "9", section: "A", gender: "Female", address: "591 Tamarind Lane, Rosewood" },
  { id: "45", name: "Siddharth Iyengar", rollNo: "905", class: "9", section: "B", gender: "Male", address: "612 Neem Drive, Mulberry" },
  
  // Class 10
  { id: "46", name: "Anjali Mohan", rollNo: "1001", class: "10", section: "A", gender: "Female", address: "723 Teak Avenue, Sassafras" },
  { id: "47", name: "Pranav Bhat", rollNo: "1002", class: "10", section: "A", gender: "Male", address: "834 Mahogany Road, Aspen Grove" },
  { id: "48", name: "Ritika Narayan", rollNo: "1003", class: "10", section: "B", gender: "Female", address: "945 Sandalwood Way, Cottonwood" },
  { id: "49", name: "Aryan Kamath", rollNo: "1004", class: "10", section: "A", gender: "Male", address: "156 Ebony Lane, Catalpa" },
  { id: "50", name: "Neha Venkatesh", rollNo: "1005", class: "10", section: "B", gender: "Female", address: "267 Rosewood Street, Ginkgo" },
];

export const getClassInfo = (): ClassInfo[] => {
  const classGroups = [
    { id: "1", name: "1", displayName: "Class 1" },
    { id: "2", name: "2", displayName: "Class 2" },
    { id: "3", name: "3", displayName: "Class 3" },
    { id: "4", name: "4", displayName: "Class 4" },
    { id: "5", name: "5", displayName: "Class 5" },
    { id: "6-10", name: "6-10", displayName: "Class 6-10" },
  ];

  return classGroups.map(cls => {
    let count: number;
    if (cls.name === "6-10") {
      count = students.filter(s => parseInt(s.class) >= 6 && parseInt(s.class) <= 10).length;
    } else {
      count = students.filter(s => s.class === cls.name).length;
    }
    return { ...cls, studentCount: count };
  });
};

export const getStudentsByClass = (classId: string): Student[] => {
  if (classId === "6-10") {
    return students.filter(s => parseInt(s.class) >= 6 && parseInt(s.class) <= 10);
  }
  return students.filter(s => s.class === classId);
};

export const getStudentById = (id: string): Student | undefined => {
  return students.find(s => s.id === id);
};

export const searchStudents = (query: string): Student[] => {
  const lowerQuery = query.toLowerCase();
  return students.filter(
    s => s.name.toLowerCase().includes(lowerQuery) || s.rollNo.toLowerCase().includes(lowerQuery)
  );
};

export const getAllClasses = (): string[] => {
  return [...new Set(students.map(s => s.class))].sort((a, b) => parseInt(a) - parseInt(b));
};
