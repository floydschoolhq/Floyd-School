import StudentDashboard from "../../components/Student/StudentDashboard";
import ClassroomPage from "./ClassRoomPage";
import CodingLabPage from "./CodingLabPage";
import PerformanceReportPage from "./PerformanceReportPage";
import ProgressTrackingPage from "./ProgressTrackingPage";
import RecordingsPage from "./RecordingPage";

const renderPage = (currentView) => {
  switch (currentView) {
    case 'Dashboard':
      return <StudentDashboard />;
    case 'Classroom':
      return <ClassroomPage />;
    case 'CodingLab':
      return <CodingLabPage />;
    case 'Recordings':
      return <RecordingsPage />;
    case 'ProgressTracking':
      return <ProgressTrackingPage />;
    case 'PerformanceReport':
      return <PerformanceReportPage />;
    default:
      return <StudentDashboard />;
  }
};
export default renderPage;