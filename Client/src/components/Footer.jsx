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
    <footer className="bg-white text-slate-500 pt-14 pb-10 border-t border-[#FBEFEF] font-['Outfit']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center font-black text-2xl mb-5 uppercase tracking-tighter">
              <span className='text-slate-900'>think</span><span className='text-[#2563EB]'>skool</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-sm font-medium">
              Building the next generation of engineers through industrial training.
            </p>

            <div className="flex space-x-4">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 bg-[#FCF8F8] border border-[#FBEFEF] rounded-xl flex items-center justify-center text-slate-400 hover:border-[#2563EB]/30 hover:text-[#2563EB] transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-slate-800 font-black mb-5 uppercase text-[9px] tracking-[0.4em]">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-xs font-medium text-slate-500 hover:text-[#2563EB] transition-colors"
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
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-[9px] font-medium uppercase tracking-widest">&copy; 2025 ThinkSkool. Engineers making Engineers.</p>
          <div className="flex gap-4 items-center">
            <img src="https://files.codingninjas.in/images/google-play-icon.svg" alt="Play Store" className="h-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
            <img src="https://files.codingninjas.in/images/app-store-icon.svg" alt="App Store" className="h-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
