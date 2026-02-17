import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPaperPlane
} from 'react-icons/fa';

const Footer = () => {
  const footerLinks = [
    {
      title: 'ThinkSkool',
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
        { name: 'Future Tech Bootcamp', href: '#programs' },
        { name: 'ThinkSkool Certifications', href: '#programs' },
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
    <footer className="bg-[#FCF8F8] text-slate-600 pt-16 pb-8 border-t border-[#FBEFEF] font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center font-black text-2xl mb-4 text-slate-900 font-['Outfit']">
              <span className='text-slate-900'>think</span><span className='text-[#2563EB]'>skool</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-sm font-medium">
              Making students <span className="text-[#2563EB] font-black">future ready</span>, not just job ready. The highest rated coding learning platform.
            </p>

            <div className="flex space-x-3">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 bg-white border border-[#FBEFEF] rounded-full flex items-center justify-center text-slate-400 hover:border-[#2563EB] hover:text-[#2563EB] transition-all duration-300 shadow-sm"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-slate-900 font-black mb-4 font-['Outfit'] uppercase text-[10px] tracking-widest">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-slate-400 hover:text-[#2563EB] transition-colors"
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
        <div className="pt-8 border-t border-[#FBEFEF] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#2563EB] font-['Outfit']">
          <p className="text-slate-400">&copy; 2025 ThinkSkool. All rights reserved.</p>
          <div className="flex gap-2 items-center">
            <img src="https://files.codingninjas.in/images/google-play-icon.svg" alt="Play Store" className="h-8 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500" />
            <img src="https://files.codingninjas.in/images/app-store-icon.svg" alt="App Store" className="h-8 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
