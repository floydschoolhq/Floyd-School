import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Mail, Phone } from 'lucide-react';

const FOOTER_LINKS = [
  {
    heading: 'Programs',
    links: [
      { name: 'AI & Machine Learning', href: '#online-focus' },
      { name: 'Coding & Web Development', href: '#online-focus' },
      { name: 'Cybersecurity', href: '#online-focus' },
      { name: 'IoT & Robotics', href: '#online-focus' },
      { name: 'Custom Program', href: '#partner-form' },
    ],
  },
  {
    heading: 'Schools',
    links: [
      { name: 'Partnership Model', href: '#why-us' },
      { name: '1 Day Immersion', href: '#roadmap' },
      { name: 'In-School Delivery', href: '#timeline' },
      { name: 'Campus Support', href: '#ecosystem' },
    ],
  },
  {
    heading: 'Students',
    links: [
      { name: 'Student Projects', href: '#student-projects' },
      { name: 'Learning Journey', href: '#roadmap' },
      { name: 'Certification', href: '#roadmap' },
      { name: 'Hackathons', href: '/hackathon' },
      { name: 'Student Login', href: '/login' },
      { name: 'Register', href: '/signup' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { name: 'About Floyd', href: '/about' },
      { name: 'Contact Us', href: '#partner-form' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

const SOCIAL = [
  { icon: Instagram, href: 'https://instagram.com/floydschoolhq', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

const PartnershipFooter = () => {
  const scrollTo = (id) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: '#060913' }}>
      {/* Top gradient line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.4), rgba(0,212,255,0.4), transparent)' }} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 pb-6">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <img
                src="/logo-white.png"
                alt="Floyd School of Technology"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="sp-body text-slate-400 text-sm leading-relaxed max-w-sm">
              Floyd School brings practical technology education into schools, helping students explore, build and develop the skills they need for a technology driven future.
            </p>
            {/* Contact */}
            <div className="space-y-2.5">
              <a href="tel:+918368801220" className="flex items-center gap-2.5 text-slate-400 hover:text-slate-200 transition-colors sp-body text-sm font-medium">
                <Phone size={14} style={{ color: '#6C63FF' }} />
                +91 8368801220
              </a>
              <a href="mailto:info@floydschool.in" className="flex items-center gap-2.5 text-slate-400 hover:text-slate-200 transition-colors sp-body text-sm font-medium">
                <Mail size={14} style={{ color: '#00D4FF' }} />
                info@floydschool.in
              </a>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3">
              {SOCIAL.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <s.icon size={16} className="text-slate-400 hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h4 className="sp-heading font-black text-white text-xs uppercase tracking-widest mb-5">{group.heading}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollTo(link.href)}
                        className="sp-body text-slate-400 hover:text-white text-xs transition-colors cursor-pointer text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <a href={link.href} className="sp-body text-slate-400 hover:text-white text-xs transition-colors">
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 pb-10 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="sp-body text-slate-500 text-xs font-medium">
            © {new Date().getFullYear()} Floyd School of Technology. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 sp-body text-slate-500 text-xs font-medium">
            <span>EVERY STUDENT HAS A DESTINATION. WE FIND THE SHORTEST PATH.</span>
          </div>
        </div>

        {/* Giant Centered Footer Branding Banner */}
        <div className="pt-4 pb-2 text-center overflow-hidden border-t border-white/5">
          <h1 className="text-[7.5vw] font-black uppercase tracking-tight leading-none whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/10 select-none">
            FLOYD SCHOOL
          </h1>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-slate-400 mt-2">
            EVERY STUDENT HAS A DESTINATION. WE FIND THE SHORTEST PATH.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PartnershipFooter;
