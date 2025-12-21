import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation

// Layout Components (Always visible or shared)

import Footer from './components/Footer';

// Static Marketing Page Components (Should only be visible on the Home route)
import Hero from './components/Hero';
import About from './components/About';
import Marque from './components/Marque';
import PremiumNavbar from './components/PremiumNavbar';


import GlobalNotificationListener from './components/GlobalNotificationListener';

import StudentLoginPage from './pages/Student/StudentLoginPage.jsx';
import StudentSignupPage from './pages/Student/StudentSignupPage.jsx';
import MainLayout from './components/Student/MainLayout.jsx';
import renderPage from './pages/Student/renderPage.jsx';
import DetailedProgram from './components/DetailedProgram.jsx';
import Contact from './components/Contact.jsx';
import Course from './components/Course.jsx';
import DownloadPage from './pages/DownloadPage.jsx';
import { PortalContext } from './components/Context/PortalProvider.jsx';



import { HeroParallaxDemo } from './components/HeroParallaxDemo';

import { TextRevealCardPreview } from './components/TextRevealCardPreview';

import Logo from './components/Logo.jsx';
import DownloadButton from './components/DownloadButton.jsx';
import StickyBottomBar from './components/StickyBottomBar.jsx';
import WhyUs from './components/WhyUs.jsx';
import Faculty from './components/Faculty.jsx';
import Masterclasses from './components/Masterclasses.jsx';
import WhyUsVideo from './components/WhyUsVideo.jsx';
import ComparisonSection from './components/ComparisonSection.jsx';
import AmbitiousSection from './components/AmbitiousSection.jsx';
import IndustrialNetwork from './components/IndustrialNetwork.jsx';

import STEMFutureSection from './components/STEMFutureSection';
import InteractiveFeatures from './components/InteractiveFeatures';
import StudentEcosystem from './components/StudentEcosystem.jsx';
import Feature from './components/Feature';

// --- Home Page Component ---
const HomePage = () => {
    return (
        <div>
            <GlobalNotificationListener />
            {/* Premium Navbar */}
            <PremiumNavbar />

            {/* 2. Fixed Download Button at Bottom Right (z-50) */}
            <DownloadButton />

            {/* 3. Scrollable Content (The rest of your components) */}
            <div className='relative pt-[64px]'>
                <Hero />
                <IndustrialNetwork />
                <Marque />
                <WhyUsVideo />
                <ComparisonSection />
                <AmbitiousSection />
                <STEMFutureSection />
                <WhyUs />
                <DetailedProgram />
                <Masterclasses />
                <Feature />
                <InteractiveFeatures isFeaturesExpanded={true} />
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
        '/student/login',
        '/student/signup',
        '/downloads',
        '/contact'

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


            {/* Main Routes */}
            <Routes>
                {/* Marketing Pages */}
                <Route path='/' element={<HomePage />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/course' element={<Course />} />

                {/* Authentication & Dashboard Routes (Hidden Layout) */}
                <Route path='/student' element={<MainLayout>
                    {renderPage(usePortal().currentView, usePortal())}
                </MainLayout>} />
                <Route path='/downloads' element={<DownloadPage />} />

                {/*Login*/}
                <Route path='/student/login' element={<StudentLoginPage />} />

                {/*Signup*/}
                <Route path='/student/signup' element={<StudentSignupPage />} />
            </Routes>

            {/* Conditional Footer Rendering */}
            {!shouldHideLayout && <Footer />}
        </div >
    );
};

// IMPORTANT: useLocation must be used inside a component wrapped by <BrowserRouter>
// Since App.jsx is usually wrapped in <BrowserRouter> in index.js, this is fine.
export default App;