import ParentDashboard from "../../components/Student/ParentDashboard";
import StudentDashboard from "../../components/Student/StudentDashboard";
import ClassroomPage from "./ClassRoomPage";
import CodingLabPage from "./CodingLabPage";
import PerformanceReportPage from "./PerformanceReportPage";
import ProgressTrackingPage from "./ProgressTrackingPage";
import RecordingsPage from "./RecordingPage";

const renderPage = (currentView, system) => {
  if (system === 'student') {
    switch (currentView) {
      case 'Dashboard':
        return <StudentDashboard />;
      case 'Classroom':
        return <ClassroomPage />;
      case 'CodingLab':
        return <CodingLabPage />;
      case 'Recordings':
        // FIX: Correctly return the RecordingsPage component
        return <RecordingsPage />;
      default:
        return <StudentDashboard />;
    }
  } else if (system === 'parent') {
    switch (currentView) {
      case 'Dashboard':
        return <ParentDashboard />;
      case 'ProgressTracking':
        return <ProgressTrackingPage />;
      case 'PerformanceReport':
        return <PerformanceReportPage />;
      default:
        return <ParentDashboard />;
    }
  }
  return null; // Should not happen if authenticated
};
export default renderPage;