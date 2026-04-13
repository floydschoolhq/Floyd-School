import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

// Layout Components (Always visible)
import Footer from './components/Footer';
import NeedHelpSection from './components/NeedHelpSection';

// Static Marketing Page Components (home page)
import Hero from './components/Hero';
import Marque from './components/Marque';
import PremiumNavbar from './components/PremiumNavbar';
import MentorGrid from './components/MentorGrid';
import PlatformPanels from './components/PlatformPanels';
import StudentProjects from './components/StudentProjects';
import SuccessStories from './components/SuccessStories';
import TechStackStats from './components/TechStackStats';
import OnlineCourseFocus from './components/OnlineCourseFocus.jsx';
import ThinkskoolAdvantage from './components/ThinkSkoolAdvantage.jsx';
import Hackathon from './components/Hackathon.jsx';

import GlobalNotificationListener from './components/GlobalNotificationListener';

// Eager load ALL student portal pages (priority - instant for logged-in users)
import StudentLoginPage from './pages/Student/StudentLoginPage.jsx';
import ClassroomPage from './pages/Student/ClassRoomPage.jsx';
import ClassroomAuthPage from './pages/Student/ClassroomAuthPage.jsx';
import MainLayout from './components/Student/MainLayout.jsx';
import renderPage from './pages/Student/renderPage.jsx';
import StudentDashboard from './components/Student/StudentDashboard';
import CodingLabPage from './pages/Student/CodingLabPage';
import PerformanceReportPage from './pages/Student/PerformanceReportPage';
import ProgressTrackingPage from './pages/Student/ProgressTrackingPage';
import RecordingsPage from './pages/Student/RecordingPage';
import SupportPage from './pages/Student/SupportPage';
import LiveSessionView from './pages/Student/LiveSessionView';
import Contact from './components/Contact.jsx';
import Course from './components/Course.jsx';
import DownloadPage from './pages/DownloadPage.jsx';
import AdminMessages from './components/AdminMessages.jsx';
import SchoolPartnership from "./pages/SchoolPartnership.jsx";
import OnlineProgram from './pages/OnlineProgram.jsx';
import BootcampGallery from './pages/BootcampGallery.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import FAQPage from './pages/FAQPage.jsx';
import AdminStudentsPage from './pages/Admin/AdminStudentsPage.jsx';
import ChatbotLeadsPage from './pages/Admin/ChatbotLeadsPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

import { usePortal } from './contexts/PortalProvider.jsx';

import { MotionConfig } from 'framer-motion';
import useIsMobile from './hooks/useIsMobile.js';
import { Toaster } from 'react-hot-toast';

// Import Chatbot
import Chatbot from './components/Chatbot';

// --- Home Page Component ---
const HomePage = () => {
    const isMobile = useIsMobile();
    return (
        <MotionConfig transition={isMobile ? { duration: 0 } : undefined}>
            <div className='relative'>
                <GlobalNotificationListener />
                <div>
                    <Hero />
                    <ThinkskoolAdvantage />
                    <TechStackStats />
                    <OnlineCourseFocus variant="dark" />
                    <MentorGrid />
                    <StudentProjects />
                    <SuccessStories variant="dark" />
                    <NeedHelpSection variant="dark" />
                </div>
            </div>
        </MotionConfig>
    )
};

const App = () => {

    const portal = usePortal();
    // 1. Get the current path
    const location = useLocation();

    const ChangeTheme = () => {

    }

    // 2. Define the paths where Navbar/Footer should be hidden
    const hideLayoutOnPaths = [
        '/student/login',
        '/student',
        '/student/dashboard',
        '/student/classroom',
        '/student/coding-lab',
        '/student/recordings',
        '/student/live-session',
        '/student/progress',
        '/student/reports',
        '/student/support',
        '/downloads',
        '/contact',
        '/online-program',
        '/classroom',
        '/school-partnerships',
        '/course',
        '/faq',
        '/bootcamp-gallery'
    ];

    // 3. Check if the current path is in the hidden list
    // This returns true if the current path matches any path in the hideLayoutOnPaths array
    const shouldHideLayout = hideLayoutOnPaths.includes(location.pathname);
    
    // Footer only shows on home page
    const showFooter = location.pathname === '/';

    // 4. Disable browser's automatic scroll restoration
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // 5. Scroll to top on route change or page refresh (using layoutEffect for immediate execution)
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);


    return (
        <div>
            {/* Toast Notifications */}
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            
            {/* Conditional Navbar Rendering */}
            {!shouldHideLayout && <PremiumNavbar />}
            {/* Main Routes */}
            <Routes>
                {/* Marketing Pages */}
                <Route path='/' element={<HomePage />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/course' element={<Course />} />
                <Route path='/course/:courseId' element={<CourseDetails />} />
                <Route path='/admin/messages' element={<ProtectedRoute><AdminMessages variant="dark" /></ProtectedRoute>} />
                <Route path='/admin/students' element={<ProtectedRoute><AdminStudentsPage /></ProtectedRoute>} />
                <Route path='/admin/chatbot-leads' element={<ProtectedRoute><ChatbotLeadsPage /></ProtectedRoute>} />

                {/* Authentication & Dashboard Routes (Hidden Layout) */}
                <Route path='/student' element={
                    <ProtectedRoute>
                        <MainLayout>
                            {renderPage(portal.currentView, portal)}
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/student/dashboard' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <StudentDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/student/classroom' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ClassroomPage />
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/student/live-session' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <LiveSessionView />
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/student/coding-lab' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CodingLabPage />
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/student/recordings' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <RecordingsPage />
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/student/progress' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ProgressTrackingPage />
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/student/reports' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <PerformanceReportPage />
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/student/support' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <SupportPage />
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/downloads' element={<DownloadPage />} />

                {/*Login*/}
                <Route path='/student/login' element={<StudentLoginPage />} />

                {/* Classroom Login (Separate Auth) */}
                <Route path='/classes' element={<ClassroomAuthPage />} />

                {/*Signup forms removed*/}

                {/* School Partnership */}
                <Route path='/school-partnerships' element={<SchoolPartnership />} />

                {/* Online Program */}
                <Route path='/online-program' element={<OnlineProgram />} />

                {/* Bootcamp Exhibition Gallery */}
                <Route path='/bootcamp-gallery' element={<BootcampGallery />} />

                {/* FAQ Page */}
                <Route path='/faq' element={<FAQPage />} />

                {/* Classroom Access */}
                <Route path='/classroom' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ClassroomPage />
                        </MainLayout>
                    </ProtectedRoute>
                } />
            </Routes>

            {/* Chatbot - Visible on home page and AI & ML course page */}
            <Chatbot />

            {/* Conditional Footer Rendering - Only on Home Page */}
            {showFooter && (
                <>
                    <Footer />
                </>
            )}
        </div >
    );
};

// IMPORTANT: useLocation must be used inside a component wrapped by <BrowserRouter>
// Since App.jsx is usually wrapped in <BrowserRouter> in index.js, this is fine.
export default App;
