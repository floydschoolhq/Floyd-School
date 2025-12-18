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
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms & Conditions', href: '/terms' },
      ],
    },
    {
      title: 'Products',
      links: [
        { name: 'Future Tech Bootcamp', href: '/bootcamp' },
        { name: 'ThinkSkool Certifications', href: '/certifications' },
        { name: 'Code 360', href: '/code360' },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Events', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Campus Ninja', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-50 text-slate-600 pt-16 pb-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center font-bold text-2xl mb-4 text-slate-900">
              <span className='text-slate-900'>think</span><span className='text-orange-500'>skool</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-sm">
              Making students <span className="text-orange-500 font-bold">future ready</span>, not just job ready. The highest rated coding learning platform.
            </p>

            <div className="flex space-x-3">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-slate-900 font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-orange-500 transition-colors"
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
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>&copy; 2025 ThinkSkool. All rights reserved.</p>
          <div className="flex gap-2 items-center">
            <img src="https://files.codingninjas.in/images/google-play-icon.svg" alt="Play Store" className="h-8" />
            <img src="https://files.codingninjas.in/images/app-store-icon.svg" alt="App Store" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;