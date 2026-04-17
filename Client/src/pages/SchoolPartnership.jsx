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
import PartnershipForm from '../components/SchoolPartnership/PartnershipForm';
import PartnershipFooter from '../components/SchoolPartnership/PartnershipFooter';
import BootcampGallery from '../components/SchoolPartnership/BootcampGallery';
// import SchoolBenefits from '../components/SchoolPartnership/SchoolBenefits';
// import StudentBenefits from '../components/SchoolPartnership/StudentBenefits';
// import StudentProjects from '../components/SchoolPartnership/StudentProjects';
// import MentorsSection from '../components/SchoolPartnership/MentorsSection';

const SchoolPartnership = () => {
  return (
    <div className="bg-white text-slate-900 font-inter selection:bg-blue-500 selection:text-white">
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
      <PartnershipForm />
      <PartnershipFooter />
    </div>
  );
};

export default SchoolPartnership;
