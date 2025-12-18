import React, { useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation

// Layout Components (Always visible or shared)

import Footer from './components/Footer';

// Static Marketing Page Components (Should only be visible on the Home route)
import Hero from './components/Hero';
import About from './components/About';
import Marque from './components/Marque';
import PremiumNavbar from './components/PremiumNavbar';


import MentorDashboard from './pages/Mentor/MentorDashboard.jsx';
import SchoolAdminPage from './pages/School/SchoolAdminPage.jsx';
import ChooseRole from './components/ChooseRole.jsx';
import DetailedProgram from './components/DetailedProgram.jsx';
import Contact from './components/Contact.jsx';
import Course from './components/Course.jsx';
import AdminLoginPage from './pages/School/AdminLoginPage.jsx';
import StudentLoginPage from './pages/Student/StudentLoginPage.jsx';
import MentorLoginPage from './pages/Mentor/MentorLoginPage.jsx';
import DownloadPage from './pages/DownloadPage.jsx';
import MainLayout from './components/Student/MainLayout.jsx';
import renderPage from './pages/Student/renderPage.jsx';
import { PortalContext } from './components/Context/PortalProvider.jsx';
import StudentSignupPage from './pages/Student/StudentSignupPage.jsx';
import MentorSignupPage from './pages/Mentor/MentorSignupPage.jsx';



import { HeroParallaxDemo } from './components/HeroParallaxDemo';

import { TextRevealCardPreview } from './components/TextRevealCardPreview';

import Logo from './components/Logo.jsx';
import DownloadButton from './components/DownloadButton.jsx';
import ParentDashboard from './components/Student/ParentDashboard.jsx';
import StickyBottomBar from './components/StickyBottomBar.jsx';
import WhyUs from './components/WhyUs.jsx';
import Faculty from './components/Faculty.jsx';
import Masterclasses from './components/Masterclasses.jsx';
import WhyUsVideo from './components/WhyUsVideo.jsx';
import ComparisonSection from './components/ComparisonSection.jsx';

import STEMFutureSection from './components/STEMFutureSection';
import InteractiveFeatures from './components/InteractiveFeatures';
import StudentEcosystem from './components/StudentEcosystem.jsx';

// --- Home Page Component ---
const HomePage = () => {
    return (
        <div>
            {/* Premium Navbar */}
            <PremiumNavbar />

            {/* 2. Fixed Download Button at Bottom Right (z-50) */}
            <DownloadButton />

            {/* 3. Scrollable Content (The rest of your components) */}
            <div className='relative pt-20'>
                <Hero />
                <Marque />
                <WhyUsVideo />
                <ComparisonSection />
                <DetailedProgram />
                <Masterclasses />
                <InteractiveFeatures />
                <StudentEcosystem />
                <Faculty />
                <HeroParallaxDemo />
                <About />
            </div>
            <StickyBottomBar />
        </div>
    )
};

const App = () => {

    const usePortal = () => useContext(PortalContext);
    // 1. Get the current path
    const location = useLocation();

    const ChangeTheme = () => {

    }

    // 2. Define the paths where Navbar/Footer should be hidden
    const hideLayoutOnPaths = [
        '/role',
        '/student',
        '/mentor',
        '/school-admin',
        // You might want to hide the layout on sub-pages within the dashboard too:
        '/admin/login',
        '/student/login',
        '/mentor/login',
        '/student/signup',
        '/mentor/signup',
        '/admin/signup',
        '/downloads',
        '/contact',
        '/parent-dashboard'

    ];

    // 3. Check if the current path is in the hidden list
    // This returns true if the current path matches any path in the hideLayoutOnPaths array
    const shouldHideLayout = hideLayoutOnPaths.includes(location.pathname);


    return (
        <div>
            {/* Conditional Navbar Rendering */}


            {/* Main Routes */}
            <Routes>
                {/* Marketing Pages */}
                <Route path='/' element={<HomePage />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/course' element={<Course />} />

                {/* Authentication & Dashboard Routes (Hidden Layout) */}
                <Route path='/role' element={<ChooseRole />} />
                <Route path='/student' element={<MainLayout>
                    {renderPage(usePortal().currentView, usePortal().system)}
                </MainLayout>} />
                <Route path='/parent-dashboard' element={<ParentDashboard />} />
                <Route path='/mentor' element={<MentorDashboard />} />
                <Route path='/school-admin' element={<SchoolAdminPage />} />
                <Route path='/downloads' element={<DownloadPage />} />

                {/* Student Dashboard Sub-routes (Hidden Layout) */}



                {/*Login*/}
                <Route path='/admin/login' element={<AdminLoginPage />} />
                <Route path='/student/login' element={<StudentLoginPage />} />
                <Route path='/mentor/login' element={<MentorLoginPage />} />

                {/*Signup*/}
                <Route path='/student/signup' element={<StudentSignupPage />} />
                <Route path='/mentor/signup' element={<MentorSignupPage />} />
            </Routes>

            {/* Conditional Footer Rendering */}
            {!shouldHideLayout && <Footer />}
        </div >
    );
};

// IMPORTANT: useLocation must be used inside a component wrapped by <BrowserRouter>
// Since App.jsx is usually wrapped in <BrowserRouter> in index.js, this is fine.
export default App;