import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPaperPlane
} from 'react-icons/fa';
import BrandLogo from './common/BrandLogo';

const Footer = () => {
  const footerLinks = [
    {
      title: <span className="font-black uppercase tracking-tighter"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span>,
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
        { name: <><span className="font-black uppercase tracking-tighter"><span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span></span> Certifications</>, href: '#engineering-programs' },
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
    <footer className="bg-[#000000] text-slate-400 pt-20 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Footer Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <BrandLogo size="lg" />
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-10 leading-loose max-w-sm">
              Architecting the next generation of global engineering excellence through industrial immersion.
            </p>

            <div className="flex space-x-5">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-11 h-11 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-400 hover:bg-[#2563EB] hover:text-white transition-all duration-500 shadow-2xl"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-black mb-8 uppercase text-[10px] tracking-[0.4em]">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">&copy; 2025 <span className="text-[#2563EB]">think</span><span className="text-[#F97316]">skool</span> Subsystems</p>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20 hidden md:block" />
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">Integrated Learning Infrastructure</p>
          </div>

          <div className="flex gap-6 items-center">
            <img src="https://files.codingninjas.in/images/google-play-icon.svg" alt="Play Store" className="h-9 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700 brightness-200" />
            <img src="https://files.codingninjas.in/images/app-store-icon.svg" alt="App Store" className="h-9 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700 brightness-200" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

