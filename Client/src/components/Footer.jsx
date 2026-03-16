import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPaperPlane
} from 'react-icons/fa';
import BrandLogo from './common/BrandLogo';
import WaveText from './common/WaveText';

const Footer = () => {
  const footerLinks = [
    {
      title: <span className="font-bold tracking-tight lowercase"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>,
      links: [
        { name: 'About Us', href: '#how-it-works' },
        { name: 'Careers', href: '/careers' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms & Conditions', href: '/terms' },
      ],
    },
    {
      title: 'Products',
      links: [
        { name: 'Future Tech Bootcamp', href: '#engineering-programs' },
        { name: <span className="lowercase"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span> certifications</span>, href: '#engineering-programs' },
        { name: 'Code 360', href: '/student/coding-lab' },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Events', href: '/events' },
        { name: 'Blog', href: '/blog' },
      ],
    },
  ];

  return (
    <footer className="bg-[#050505] text-slate-400 pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Premium Ambient Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none -mr-48 -mt-48" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none -ml-32" />
      
      {/* Industrial Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-10">
              <BrandLogo size="lg" className="items-start" />
            </div>
            <p className="text-slate-500 text-[15px] font-medium tracking-tight mb-12 leading-relaxed max-w-sm">
              Architecting the next generation of global engineering excellence through industrial immersion.
            </p>

            <div className="flex space-x-4">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-slate-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-700 shadow-2xl group"
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-black mb-10 text-[13px] tracking-[0.2em] uppercase opacity-90">{section.title}</h3>
                <ul className="space-y-5">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-[14px] font-bold tracking-tight text-slate-500 hover:text-orange-500 transition-all duration-300"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Signature: The Large Wave Logo */}
        <div className="w-full relative border-t border-white/5 pt-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <WaveText text="thinkskool" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

