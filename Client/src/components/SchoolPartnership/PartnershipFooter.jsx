import BrandLogo from '../common/BrandLogo';

const PartnershipFooter = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Footer */}
        <div className="md:hidden mb-12">
          <div className="mb-4 flex justify-start">
            <BrandLogo size="xs" showTagline={false} theme="brand" className="items-start" />
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Bridging classroom learning with real technology skills.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Programs */}
            <div>
              <h4 className="font-bold mb-3 text-white text-sm">Programs</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">School Bootcamp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI &amp; ML</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cybersecurity</a></li>
                <li><a href="#" className="hover:text-white transition-colors">IoT &amp; Robotics</a></li>
              </ul>
            </div>

            {/* For Schools */}
            <div>
              <h4 className="font-bold mb-3 text-white text-sm">For Schools</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#what-you-get" className="hover:text-white transition-colors">What You Get</a></li>
                <li><a href="#roadmap" className="hover:text-white transition-colors">Program Roadmap</a></li>
                <li><a href="#partner-form" className="hover:text-white transition-colors">Partner With Us</a></li>
              </ul>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold mb-3 text-white text-sm">Connect</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="https://floydschool.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">floydschool.in</a></li>
              <li><a href="https://instagram.com/thinkskool.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="tel:+91-8368801220" className="hover:text-white transition-colors">+91-8368801220</a></li>
              <li><a href="mailto:floydschoolhq@gmail.com" className="hover:text-white transition-colors break-all">floydschoolhq@gmail.com</a></li>
            </ul>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="hidden md:grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4 flex justify-start">
              <BrandLogo size="sm" showTagline={false} theme="brand" className="items-start" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bridging the gap between classroom and tech industry. We are building the next generation of engineers, right where they are.
            </p>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold mb-4">Programs</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">School Bootcamp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI &amp; Machine Learning</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cybersecurity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IoT &amp; Robotics</a></li>
            </ul>
          </div>

          {/* For Schools */}
          <div>
            <h4 className="font-bold mb-4">For Schools</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">What You Get</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Program Roadmap</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner With Us</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="https://floydschool.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">floydschool.in</a></li>
              <li><a href="https://instagram.com/thinkskool.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="mailto:floydschoolhq@gmail.com" className="hover:text-white transition-colors">Email Us</a></li>
              <li><a href="tel:+91-8368801220" className="hover:text-white transition-colors">+91-8368801220</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
          <p>© Floyd School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PartnershipFooter;
