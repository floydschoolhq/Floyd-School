import React from 'react';
// Import icons from react-icons (using Font Awesome 5 for consistency)
import { FaPlayCircle, FaCode, FaBrain, FaUsers, FaChalkboardTeacher, FaTrophy, FaChevronDown } from 'react-icons/fa';

const InteractiveFeatures = ({isFeaturesExpanded}) => {
    const MAIN_COLOR="#FF8C00";
    const PRIMARY_BLUE = '#007FFF'; 

    const interactiveFeaturesList = [
      {
        icon: <FaPlayCircle />,
        title: 'HD Video Content',
        description: 'Crystal clear video lessons with expert instructors',
      },
      {
        icon: <FaCode />,
        title: 'Integrated Code Editor',
        description: 'Practice coding directly in the browser with real-time feedback',
      },
      {
        icon: <FaBrain />,
        title: 'AI-Powered Quizzes',
        description: 'Adaptive assessments that adjust to your learning pace',
      },
    ];

    const communityFeaturesList = [
      {
        icon: <FaUsers />,
        title: 'Live Study Groups',
        description: 'Connect with peers and collaborate on projects',
      },
      {
        icon: <FaChalkboardTeacher />,
        title: '24/7 Mentor Support',
        description: 'Get help whenever you need it from our expert mentors',
      },
      {
        icon: <FaTrophy />,
        title: 'Gamification',
        description: 'Earn badges and certificates as you progress',
      },
    ];


    return (
      <section className="py-16 md:py-24 bg-white text-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Collapsible Content Area */}
          <div 
            // The max-h value should be very large when expanded to ensure the entire content block fits.
            // On mobile, the two sections stack (single column). On lg screens, they go side-by-side (two columns).
            className={`
              transition-all duration-700 ease-in-out 
              ${isFeaturesExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} 
              overflow-hidden 
              grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16
            `}
          >
            
            {/* --- Interactive Learning Section (Left Column on Desktop) --- */}
            <div className="mb-8 lg:mb-0"> 
              <h2 
                className="text-4xl md:text-5xl font-extrabold mb-10" 
                style={{ color: MAIN_COLOR }}
              >
                Interactive Learning
              </h2>
              <div className="space-y-8">
                {interactiveFeaturesList.map((feature, index) => (
                  <FeatureItem key={index} feature={feature} color={PRIMARY_BLUE} />
                ))}
              </div>
            </div>
            
            {/* --- Community & Support Section (Right Column on Desktop) --- */}
            <div>
              <h2 
                className="text-4xl md:text-5xl font-extrabold mb-10" 
                style={{ color: MAIN_COLOR }}
              >
                Community & Support
              </h2>
              <div className="space-y-8">
                {communityFeaturesList.map((feature, index) => (
                  <FeatureItem key={index} feature={feature} color={PRIMARY_BLUE} />
                ))}
              </div>
            </div>
            
          </div>

        </div>
      </section>
    );
};

// Reusable component for individual feature items
const FeatureItem = ({ feature, color }) => (
    <div className="flex items-start gap-6">
      <div 
        className="shrink-0 text-4xl mt-1" 
        style={{ color: color }}
      >
        {feature.icon}
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-bold mb-1">{feature.title}</h3>
        <p className="text-gray-600 text-lg">{feature.description}</p>
      </div>
    </div>
);

export default InteractiveFeatures;