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
import useIsMobile from '../hooks/useIsMobile';
import { Link } from 'react-router-dom';



const Footer = () => {
  const isMobile = useIsMobile();
  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'Home', href: '/' },
        { name: 'School Partnerships', href: '/school-partnerships' },
        { name: 'Online Programs', href: '/online-program' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Terms & Conditions', href: '/finalthinkskoolTerms and Conditions.pdf', target: '_blank', rel: 'noopener noreferrer' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { name: 'All Courses', href: '/course' },
        { name: 'Bootcamp Gallery', href: '/bootcamp-gallery' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Downloads', href: '/downloads' },
      ],
    },
    {
      title: 'Student Portal',
      links: [
        { name: 'Student Login', href: '/student/login' },
        { name: 'Classroom Access', href: '/classes' },
        { name: 'Progress Tracking', href: '/student/progress' },
      ],
    },
  ];

  if (isMobile) {
    return (
      <footer className="bg-slate-950 px-8 pt-20 pb-20 border-t border-white/5 relative overflow-hidden">
        {/* Subtle Background Mesh */}
        <div className="absolute inset-0 opacity-[0.03] invert brightness-200 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Simplified Mobile Links */}
          <div className="w-full mb-16">
            <ul className="flex flex-col items-center gap-6">
              {[
                { name: 'Home', href: '/' },
                { name: 'Courses', href: '/course' },
                { name: 'Partner with Us', href: '/school-partnerships' },
                { name: 'Terms & Conditions', href: '/finalthinkskoolTerms and Conditions.pdf', target: '_blank', rel: 'noopener noreferrer' },
              ].map((link, i) => (
                <li key={i}>
                  {link.href.startsWith('/') && !link.target ? (
                    <Link 
                      to={link.href} 
                      className="text-slate-400 text-[12px] font-black tracking-[0.2em] hover:text-orange-500 transition-colors uppercase"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a 
                      href={link.href} 
                      target={link.target || '_self'}
                      rel={link.rel || ''}
                      className="text-slate-400 text-[12px] font-black tracking-[0.2em] hover:text-orange-500 transition-colors uppercase"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 border-t border-white/5 w-full text-center">
             <p className="text-slate-700 text-[8px] font-black uppercase tracking-[0.3em]">
                © 2026 THINKSKOOL. <br className="mt-2" />
                ENGINEERED FOR EXCELLENCE.
             </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-br from-black via-slate-950 to-black text-slate-400 pt-24 md:pb-12 pb-32 border-t border-white/5 relative overflow-hidden">
      {/* Background mesh - matching CourseReviews */}
      <div className="absolute inset-0 pointer-events-none opacity-30 invert brightness-200" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] -ml-80 -mt-80 opacity-40 bg-blue-600/5" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-60 -mb-60 opacity-40 bg-amber-600/5" />

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
              {[
                { icon: FaFacebookF, href: 'https://www.facebook.com/thinkskool.in' },
                { icon: FaTwitter, href: 'https://x.com/thinkskool' },
                { icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/thinkskool/' },
                { icon: FaInstagram, href: 'https://www.instagram.com/thinkskool.in?igsh=MWlhOWlpc2ZuOGd6&utm_source=qr' }
              ].map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-700 shadow-2xl group"
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
                      {link.href.startsWith('/') && !link.target ? (
                        <Link
                          to={link.href}
                          className="text-[14px] font-bold tracking-tight text-slate-500 hover:text-orange-500 transition-all duration-300"
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          target={link.target || '_self'}
                          rel={link.rel || ''}
                          className="text-[14px] font-bold tracking-tight text-slate-500 hover:text-orange-500 transition-all duration-300"
                        >
                          {link.name}
                        </a>
                      )}
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

