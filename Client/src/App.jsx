import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation

// Layout Components (Always visible or shared)
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import NeedHelpSection from './components/NeedHelpSection';

// Static Marketing Page Components (Should only be visible on Home route)
import Hero from './components/Hero';
import About from './components/About';
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
import StudentLoginPage from './pages/Student/StudentLoginPage.jsx';
import ClassroomPage from './pages/Student/ClassRoomPage.jsx';
import MainLayout from './components/Student/MainLayout.jsx';
import renderPage from './pages/Student/renderPage.jsx';
import Contact from './components/Contact.jsx';
import Course from './components/Course.jsx';
import DownloadPage from './pages/DownloadPage.jsx';
import AdminMessages from './components/AdminMessages.jsx';
import { PortalContext } from './components/Context/PortalProvider.jsx';
import SchoolPartnership from "./pages/SchoolPartnership.jsx";
import OnlineProgram from './pages/OnlineProgram.jsx';
import BootcampGallery from './pages/BootcampGallery.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import FAQPage from './pages/FAQPage.jsx';
import AdminStudentsPage from './pages/Admin/AdminStudentsPage.jsx';

import Logo from './components/Logo.jsx';

import Masterclasses from './components/Masterclasses.jsx';
import IndustrialNetwork from './components/IndustrialNetwork.jsx';

import { MotionConfig } from 'framer-motion';
import useIsMobile from './hooks/useIsMobile.js';
import { Toaster } from 'react-hot-toast';

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
                    <MentorGrid isStatic={true} />
                    <StudentProjects />
                    <SuccessStories variant="dark" />
                    <NeedHelpSection variant="dark" />
                </div>
            </div>
        </MotionConfig>
    )
};

import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

const App = () => {

    const usePortal = () => useContext(PortalContext);
    // 1. Get the current path
    const location = useLocation();

    const ChangeTheme = () => {

    }

    // 2. Define the paths where Navbar/Footer should be hidden
    const hideLayoutOnPaths = [
        '/student/login',
        '/student',
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
                <Route path='/admin/messages' element={<AdminMessages variant="dark" />} />

                {/* Authentication & Dashboard Routes (Hidden Layout) */}
                <Route path='/student' element={
                    <ProtectedRoute>
                        <MainLayout>
                            {renderPage(usePortal().currentView, usePortal())}
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path='/downloads' element={<DownloadPage />} />

                {/*Login*/}
                <Route path='/student/login' element={<StudentLoginPage />} />

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

            {/* Conditional Footer Rendering - Only on Home Page */}
            {showFooter && (
                <>
                    <MobileBottomNav />
                    <Footer />
                </>
            )}
        </div >
    );
};

// IMPORTANT: useLocation must be used inside a component wrapped by <BrowserRouter>
// Since App.jsx is usually wrapped in <BrowserRouter> in index.js, this is fine.
export default App;
