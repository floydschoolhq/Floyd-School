const PartnershipFooter = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-blue-400">think</span>
              <span className="text-orange-400">skool</span>
            </h3>
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
              <li><a href="#" className="hover:text-white transition-colors">AI & Machine Learning</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cybersecurity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IoT & Robotics</a></li>
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
              <li><a href="https://thinkskool.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">thinkskool.in</a></li>
              <li><a href="https://instagram.com/thinkskool.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="mailto:thinkskool.office@gmail.com" className="hover:text-white transition-colors">Email Us</a></li>
              <li><a href="tel:+91-8527740849" className="hover:text-white transition-colors">+91-8527740849</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
          <p>© 2024 thinkskool Institutional Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PartnershipFooter;
