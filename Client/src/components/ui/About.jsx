/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
// Import icons from react-icons
import { MdOutlinePublic, MdOutlineLightbulb, MdOutlineVerified } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { GiLaptop, GiTeacher, GiChart } from 'react-icons/gi'; // Added relevant icons
import { GlowingCard } from './GlowingCard';

const About = () => {
  // Used Tailwind's blue-600 color code for consistency
  const ACCENT_BLUE = '#2563EB';

  // Framer Motion variants for the right-side animation
  const rightSideVariants = {
    // Hidden state: off-screen to the right and opaque
    hidden: { opacity: 0.2, x: 100 },
    // Visible state: in final position, fully opaque
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        delay: 0.1
      }
    },
  };

  // Define the key program features based on the provided text
  const features = [
    {
      icon: GiLaptop,
      title: 'Project-First Methodology',
      description: 'Hands-on learning supported by cloud labs and structured paths.'
    },
    {
      icon: GiTeacher,
      title: 'Trained Engineering Mentors',
      description: 'Programs delivered by qualified professionals aligned with school schedules.'
    },
    {
      icon: GiChart,
      title: 'School-Integrated Curriculum',
      description: 'Adapted to the academic structure for learning without extra pressure.'
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-950 text-white" id="about">
      <h2 className='text-6xl flex justify-center items-center font-bold mb-10 text-white'>About us</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* --- Left Side: Text Content (Updated) --- */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8 leading-tight">
              Who We Are
            </h1>

            {/* ThinkSkool Description */}
            <p className="text-lg text-slate-300 mb-6 leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0">
              ThinkSkool is a school-integrated STEM education program designed to make
              technology learning accessible, practical, and engaging. We follow a
              project-first methodology supported by cloud labs, dashboards, and
              well-structured learning paths.
            </p>

            {/* Mission and Vision */}
            <div className="space-y-6 mb-12 border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/20 rounded-md shadow-inner">
              <h3 className="text-2xl font-semibold text-white">Our Mission & Vision</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                Mission: To empower students with future-ready skills by embedding high-quality
                STEM education directly into school systems across India.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Vision: To turn every classroom into an innovation hub where students feel
                confident to build, experiment, and solve real problems.
              </p>
            </div>

            {/* Who We Serve */}
            <div className="text-center lg:text-left mt-8">
              <h3 className="text-2xl font-bold text-white mb-4">Who We Serve </h3>
              <p className="text-lg text-slate-300 font-medium">
                We work with schools, students, and parents to create engaging, transparent,
                and outcome-driven STEM learning.
              </p>
            </div>
          </div>

          {/* --- Right Side: Animated Visual & Feature List (Updated) --- */}
          <motion.div
            variants={rightSideVariants}
            initial="hidden"
            // Triggers the slide-in animation when scrolled into view
            whileInView="visible"
            // The key change: once: false ensures the animation reverses when the element leaves the viewport
            viewport={{ once: false, amount: 0.5 }}
          >
            <GlowingCard>
              <h2 className="text-3xl font-bold text-white mb-4 z-10 pt-4">Our Core Approach</h2>
              {/* Large central icon */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-200/10 text-[10rem] md:text-[12rem] z-0">
                <MdOutlineLightbulb /> {/* Changed icon to one representing innovation/approach */}
              </div>

              {/* Feature List (Updated to reflect ThinkSkool's approach) */}
              <ul className="relative z-10 space-y-8 mt-10 md:mt-16">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.3 + index * 0.15, type: 'spring', stiffness: 100 }}
                  >
                    <feature.icon className="text-4xl shrink-0" style={{ color: ACCENT_BLUE }} />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                      <p className="text-slate-400">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </GlowingCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;