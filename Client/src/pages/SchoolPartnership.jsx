import { useEffect } from 'react';
import Lenis from 'lenis';

import SEO from '../components/common/SEO';
import PartnershipHero from '../components/SchoolPartnership/PartnershipHero';
import BootcampGallery from '../components/SchoolPartnership/BootcampGallery';

import MeetInnovators from '../components/SchoolPartnership/MeetInnovators';
import LmsSection from '../components/SchoolPartnership/LmsSection';
import SchoolEcosystemOrbit from '../components/SchoolPartnership/SchoolEcosystemOrbit';
import OurBatchesSection from '../components/SchoolPartnership/OurBatchesSection';
import ProgramRoadmap from '../components/SchoolPartnership/ProgramRoadmap';
import PartnershipStory from '../components/SchoolPartnership/PartnershipStory';
import TheProblem from '../components/SchoolPartnership/TheProblem';
import StudentPhilosophy from '../components/SchoolPartnership/StudentPhilosophy';
import SchoolBenefits from '../components/SchoolPartnership/SchoolBenefits';
import StudentBenefits from '../components/SchoolPartnership/StudentBenefits';
import TestimonialsSection from '../components/SchoolPartnership/TestimonialsSection';
import SuccessStories from '../components/SuccessStories';
import StudentProjects from '../components/SchoolPartnership/StudentProjects';
import GroupProjects from '../components/SchoolPartnership/GroupProjects';
import PartnershipRoadmap from '../components/SchoolPartnership/PartnershipRoadmap';
import PartnershipForm from '../components/SchoolPartnership/PartnershipForm';
import PartnershipFooter from '../components/SchoolPartnership/PartnershipFooter';
import StudentTestimonials from '../components/SchoolPartnership/StudentTestimonials';

const SchoolPartnership = () => {
  // Initialize Lenis smooth scroll — only on this page
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className="bg-[var(--bg-setu)] text-[var(--dark-setu)] overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <SEO
        title="School Partnerships — Floyd School of Technology"
        description="Hands on technology education for Classes 6 to 12. Partner with Floyd School for expert-led AI, Coding, Robotics, and Cybersecurity programs."
      />

      {/* 1. Full-screen Hero */}
      <PartnershipHero />

      {/* 1b. Meet Our Innovators photo gallery */}
      <MeetInnovators />


      {/* 3c. Trusted By Schools logo marquee section */}
      <BootcampGallery />

      {/* 3b. Integrated Campus Ecosystem Orbit Hub */}
      <SchoolEcosystemOrbit />

      {/* 3c. School Partnership Story */}
      <PartnershipStory />

      {/* 3d. Our Batches */}
      <OurBatchesSection />

      {/* 4. Why Us */}
      <TheProblem />

      {/* 4b. For School Leaders */}
      <SchoolBenefits />

      {/* 3. Learning Management System */}
      <LmsSection />

      {/* 4c. Program Roadmap Timeline */}
      <ProgramRoadmap />

      {/* 4d. The Floyd Approach: Action Over Observation */}
      <StudentPhilosophy />

      {/* 5. Student Projects Showcase */}
      <StudentProjects />

      {/* 5b. What Students Gain */}
      <StudentBenefits />

      {/* 8. Testimonials */}
      <TestimonialsSection />

      {/* 8a. Student Video Testimonials */}
      <StudentTestimonials />

      {/* 8b. Transformed By Floyd School */}
      <SuccessStories variant="dark" />

      {/* 10. Partnership Process Timeline */}
      <GroupProjects />

      {/* 11. FAQ Accordion */}
      <PartnershipRoadmap />

      {/* 12. Final CTA Banner */}
      <PartnershipForm />

      {/* Footer */}
      <PartnershipFooter />
    </div>
  );
};

export default SchoolPartnership;
