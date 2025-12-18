export const MOCK_COURSES = [
{ id: 1, name: 'Advanced React Development', modules: 12, assignments: 5, active: true },
{ id: 2, name: 'Node.js Backend Deep Dive', modules: 8, assignments: 4, active: true },
{ id: 3, name: 'Database Fundamentals', modules: 6, assignments: 3, active: false },
];


export const MOCK_ASSIGNMENTS = [
{ id: 101, title: 'React Hooks Project', courseId: 1, dueDate: '2025-11-25', totalSubmissions: 28, graded: 20 },
{ id: 102, title: 'Express API Design', courseId: 2, dueDate: '2025-11-28', totalSubmissions: 25, graded: 15 },
{ id: 103, title: 'SQL Query Optimization', courseId: 3, dueDate: '2025-12-05', totalSubmissions: 30, graded: 30 },
];


export const MOCK_EVALUATIONS = [
{ id: 201, student: 'Alice Johnson', assignment: 'React Hooks Project', submissionDate: '2025-11-20', status: 'Pending', score: null },
{ id: 202, student: 'Bob Smith', assignment: 'Express API Design', submissionDate: '2025-11-21', status: 'Pending', score: null },
{ id: 203, student: 'Charlie Brown', assignment: 'React Hooks Project', submissionDate: '2025-11-19', status: 'Graded', score: 92 },
{ id: 204, student: 'Diana Prince', assignment: 'SQL Query Optimization', submissionDate: '2025-11-18', status: 'Graded', score: 85 },
];


export const MOCK_STUDENT_PROGRESS = [
{ id: 301, name: 'Alice Johnson', completion: 75, averageScore: 88, activeModules: 9 },
{ id: 302, name: 'Bob Smith', completion: 60, averageScore: 78, activeModules: 8 },
{ id: 303, name: 'Charlie Brown', completion: 90, averageScore: 94, activeModules: 11 },
{ id: 304, name: 'Diana Prince', completion: 80, averageScore: 85, activeModules: 10 },
];

export const MOCK_USERS = {
  // Default Credentials: 'student' role
  'student@school.com': { role: 'student', name: 'Alex Johnson', studentId: 'S1001' },
  // Default Credentials: 'parent' role
  'parent@school.com': { role: 'parent', name: 'Mr. David Johnson', studentName: 'Alex Johnson', studentId: 'S1001' },
};


export const MOCK_DATA = {
  lessons: [
    { id: 1, title: 'Introduction to Algorithms', status: 'Completed', link: '#', progress: 100 },
    { id: 2, title: 'React Hooks Deep Dive', status: 'In Progress', link: '#', progress: 65 },
    { id: 3, title: 'Database Normalization', status: 'Not Started', link: '#', progress: 0 },
  ],
  assignments: [
    { id: 101, title: 'Data Structures Quiz', dueDate: '2025-09-20', status: 'Graded (92%)' },
    { id: 102, title: 'Web Frameworks Project', dueDate: '2025-10-15', status: 'Pending Review' },
    { id: 103, title: 'Final Exam Preparation', dueDate: '2025-11-01', status: 'Drafting' },
  ],
  recordings: [
    { id: 201, title: 'Lecture 5: State Management', date: '2025-08-28', duration: '1:15:00' },
    { id: 202, title: 'Tutorial: Tailwind Styling', date: '2025-09-04', duration: '0:45:00' },
  ],
};
