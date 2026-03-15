import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation

// Layout Components (Always visible or shared)

import Footer from './components/Footer';

// Static Marketing Page Components (Should only be visible on the Home route)
import Hero from './components/Hero';
import About from './components/About';
import Marque from './components/Marque';
import PremiumNavbar from './components/PremiumNavbar';
import MentorGrid from './components/MentorGrid';
import PlatformPanels from './components/PlatformPanels';
import SuccessStories from './components/SuccessStories';
import LearningModel from './components/LearningModel';


import GlobalNotificationListener from './components/GlobalNotificationListener';
import StudentLoginPage from './pages/Student/StudentLoginPage.jsx';
import ClassroomPage from './pages/Student/ClassRoomPage.jsx';
import MainLayout from './components/Student/MainLayout.jsx';
import renderPage from './pages/Student/renderPage.jsx';
import Contact from './components/Contact.jsx';
import Course from './components/Course.jsx';
import DownloadPage from './pages/DownloadPage.jsx';
import { PortalContext } from './components/Context/PortalProvider.jsx';
import SchoolPartnership from './pages/SchoolPartnership.jsx';
import OnlineProgram from './pages/OnlineProgram.jsx';
import BootcampGallery from './pages/BootcampGallery.jsx';
import CourseDetails from './pages/CourseDetails.jsx';



import Logo from './components/Logo.jsx';
import StickyBottomBar from './components/StickyBottomBar.jsx';
import Masterclasses from './components/Masterclasses.jsx';
import IndustrialNetwork from './components/IndustrialNetwork.jsx';
import OnlineCourseFocus from './components/OnlineCourseFocus.jsx';
import TechStackStats from './components/TechStackStats.jsx';


import InteractiveFeatures from './components/InteractiveFeatures';
import ThinkSkoolAdvantage from './components/ThinkSkoolAdvantage.jsx';
import Hackathon from './components/Hackathon.jsx';


import { MotionConfig } from 'framer-motion';
import useIsMobile from './hooks/useIsMobile.js';

// --- Home Page Component ---
const HomePage = () => {
    const isMobile = useIsMobile();
    return (
        <MotionConfig transition={isMobile ? { duration: 0 } : undefined}>
            <div>
                <GlobalNotificationListener />
                <div className='relative'>
                    <Hero />
                    <ThinkSkoolAdvantage />
                    <TechStackStats />
                    <OnlineCourseFocus />
                    <MentorGrid />
                    <LearningModel />
                    <InteractiveFeatures isFeaturesExpanded={true} />
                    <SuccessStories />
                </div>
                <StickyBottomBar />
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
        '/classroom'
    ];

    // 3. Check if the current path is in the hidden list
    // This returns true if the current path matches any path in the hideLayoutOnPaths array
    const shouldHideLayout = hideLayoutOnPaths.includes(location.pathname);

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
            {/* Conditional Navbar Rendering */}
            {!shouldHideLayout && <PremiumNavbar />}
            {/* Main Routes */}
            <Routes>
                {/* Marketing Pages */}
                <Route path='/' element={<HomePage />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/course' element={<Course />} />
                <Route path='/course/:courseId' element={<CourseDetails />} />

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

                {/* Classroom Access */}
                <Route path='/classroom' element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ClassroomPage />
                        </MainLayout>
                    </ProtectedRoute>
                } />
            </Routes>

            {/* Conditional Footer Rendering */}
            {!shouldHideLayout && <Footer />}
        </div >
    );
};

// IMPORTANT: useLocation must be used inside a component wrapped by <BrowserRouter>
// Since App.jsx is usually wrapped in <BrowserRouter> in index.js, this is fine.
export default App;
