import PartnershipHero from '../components/SchoolPartnership/PartnershipHero';
import TheProblem from '../components/SchoolPartnership/TheProblem';
import HowItWorks from '../components/SchoolPartnership/HowItWorks';
import WhatSchoolGets from '../components/SchoolPartnership/WhatSchoolGets';
import GroupProjects from '../components/SchoolPartnership/GroupProjects';
import FourStageLearning from '../components/SchoolPartnership/FourStageLearning';
import PartnershipRoadmap from '../components/SchoolPartnership/PartnershipRoadmap';
import PartnershipDomains from '../components/SchoolPartnership/PartnershipDomains';
import NationalHackathon from '../components/SchoolPartnership/NationalHackathon';
import WhyPartnerWithUs from '../components/SchoolPartnership/WhyPartnerWithUs';
import TestimonialsSection from '../components/SchoolPartnership/TestimonialsSection';
import SEO from '../components/common/SEO';
import LocalizedSEOSection from '../components/common/LocalizedSEOSection';
// import SchoolBenefits from '../components/SchoolPartnership/SchoolBenefits';
// import StudentBenefits from '../components/SchoolPartnership/StudentBenefits';
// import StudentProjects from '../components/SchoolPartnership/StudentProjects';
// import MentorsSection from '../components/SchoolPartnership/MentorsSection';

const SchoolPartnership = () => {
  return (
    <div className="bg-white text-slate-900 font-inter selection:bg-blue-500 selection:text-white">
      <SEO 
        title="School Partnerships & Tech Bootcamps" 
        description="Partner with Thinkskool to bring industrial-grade tech education to your school. We offer free trial bootcamps, specialized tracks, and national hackathons."
      />
      <PartnershipHero />
      <BootcampGallery />
      <TheProblem />
      <HowItWorks />
      


      <WhatSchoolGets />
      <GroupProjects />
      <FourStageLearning />
      <PartnershipRoadmap />
      <PartnershipDomains />
      <NationalHackathon />
      <WhyPartnerWithUs />
      <TestimonialsSection />
      
      {/* Crawlable Content Section for SEO */}
      <LocalizedSEOSection 
        title="Architecting Future Leaders"
        highlight="through School Partnerships"
        dark={false}
        paragraphs={[
          "In today's rapidly evolving digital economy, the traditional academic curriculum often struggles to keep pace with industrial demands. Thinkskool's School Partnership program is designed to bridge this critical gap, transforming schools into hubs of technical excellence and innovation. By integrating industrial-grade tech education directly into the school ecosystem, we empower students with the skills required for the 21st-century workforce.",
          "Our partnership model is built on the foundation of \"Industrial Immersion.\" We don't just teach coding; we teach students how to think like engineers. From AI and Machine Learning to Robotics and Cybersecurity, our programs provide students with hands-on experience using the same tools and methodologies used by global tech leaders. This exposure at an early age is transformative, fostering a mindset of problem-solving and critical thinking that extends beyond the computer lab.",
          "Schools that partner with Thinkskool benefit from a comprehensive support system. We provide highly trained mentors, specialized hardware kits, and a robust curriculum that is updated quarterly to reflect industry shifts. Our 7-day free trial bootcamp allows schools and students to experience our high-impact teaching methodology without any initial commitment, ensuring a perfect fit for every institution.",
          "The impact of our partnerships is measurable and profound. Through our administrative dashboard, schools can track real-time progress, attendance, and assessment scores for every student. This data-driven approach allows for personalized intervention and ensures that every child is moving towards technical mastery.",
          "Our semester-end certifications and national-level hackathons provide students with the recognition and competitive edge they need for future academic and career pursuits. Join the growing network of forward-thinking educational institutions that are redefining what's possible in school-level technical education. Partner with Thinkskool today and let's architect the future of engineering excellence together."
        ]}
      />
      <PartnershipForm />
    </div>
  );
};

export default SchoolPartnership;
