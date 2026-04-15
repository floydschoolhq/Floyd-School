const MentorsSection = () => {
  const mentors = [
    {
      name: 'Shivam Mishra',
      experience: '3+ Years Experience',
      description: 'An international hackathon winner with experience leading multiple startups. Builds innovative tech solutions with a strong entrepreneurial mindset. Leads ThinkSkool, shaping its vision and impact.',
      image: '/assets/shivam-DQpqvpJJ.jpg',
      linkedin: 'https://www.linkedin.com/in/shivammishra0809/?originalSubdomain=in'
    },
    {
      name: 'Raghav Sharma',
      experience: '4+ Years Experience',
      description: 'A B.Tech CSE student specializing in web application security and advanced vulnerability assessment. Certified CRTA and CNSP, with hands-on expertise in offensive security tools and real-world attack simulations. Applies practical cybersecurity skills and enhances hands-on learning at ThinkSkool.',
      image: '/assets/raghav-BBcpNXPV.jpg',
      linkedin: 'https://www.linkedin.com/in/heyraghav?utm_source=share_via&utm_content=profile&utm_medium=member_android'
    },
    {
      name: 'Abhay Singh Chauhan',
      experience: '3+ Years Experience',
      description: 'A developer skilled in building modern, scalable web solutions. Combines AI with practical development for real-world applications. Leads web development and training at ThinkSkool.',
      image: '/assets/abhay-Cbr3t6XX.jpg',
      linkedin: 'https://www.linkedin.com/in/abhay-singh-chauhan-485706310'
    },
    {
      name: 'Anamika Vashisth',
      experience: '2+ Years Experience',
      description: 'A growth-focused professional with expertise in data analytics and AI. Known for combining technical skills with strong student engagement. Drives student growth and strategy at ThinkSkool.',
      image: '/assets/anamika-TXK6mu_Q.jpg',
      linkedin: 'https://www.linkedin.com/in/anamika-vashisth-28232b328?utm_source=share_via&utm_content=profile&utm_medium=member_android'
    },
    {
      name: 'Shashwat Vashishth',
      experience: '2+ Years Experience',
      description: 'A skilled professional with expertise in artificial intelligence and machine learning. Focused on practical, industry-relevant learning and mentorship. Guides students as a Tutor at ThinkSkool.',
      image: '/assets/shashwat-DoHWMwD_.png',
      linkedin: 'https://www.linkedin.com/in/shashwat-vashishth'
    },
    {
      name: 'Shan Sharma',
      experience: '3+ Years Experience',
      description: 'A tech professional working in an MNC with international project experience. Strong in problem-solving and structured execution. Supported and mentored 3000+ students at ThinkSkool.',
      image: '/assets/sshan-DMMv2ave.png',
      linkedin: 'https://www.linkedin.com/in/shan-sharma-726706292'
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
      <div className="flex flex-col items-center justify-center mt-16 mb-12 text-center sm:mt-20 md:mt-16">
        <div className="w-full">
          <div className="flex justify-center">
            <h2 className="text-3xl md:text-8xl font-black uppercase tracking-tighter leading-none text-slate-500">
              Mentors
            </h2>
          </div>
        </div>
      </div>
      
      <div className="relative group/marquee">
        <div className="overflow-hidden py-10 -mx-4 px-4">
          <style>
            {`
              #mentors-grid .mentors-marquee-track {
                animation: mentorsMarquee 35s linear infinite;
                will-change: transform;
              }
              #mentors-grid .mentors-marquee-track:hover {
                animation-play-state: paused;
              }
              @keyframes mentorsMarquee {
                from { transform: translateX(0%); }
                to { transform: translateX(-50%); }
              }
            `}
          </style>
          <div className="mentors-marquee-track flex items-center gap-8 w-max">
            {[...mentors, ...mentors].map((mentor, index) => (
              <div
                key={index}
                className="snap-center flex-shrink-0 w-[85vw] md:w-[600px] h-[450px] md:h-[320px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border transition-all duration-700 flex flex-col md:flex-row items-center p-8 md:p-10 gap-8 md:gap-10 relative group cursor-default bg-white border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(251,146,60,0.25)] hover:border-orange-500/30 bg-gradient-to-br from-white to-orange-50/30"
              >
                <div className="w-32 h-32 md:w-44 md:h-44 flex-shrink-0 relative">
                  <div className="absolute inset-0 rounded-full overflow-hidden z-10">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
                      <img
                        alt={mentor.name}
                        className="w-full h-full object-cover object-top"
                        src={mentor.image}
                        style={{ transform: 'scale(1.9)' }}
                      />
                    </div>
                  </div>
                  <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-0 right-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 z-20 border-2 group/linkedin bg-slate-900 border-white hover:bg-orange-500"
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 448 512"
                      className="group-hover/linkedin:scale-110 transition-transform"
                      height="14"
                      width="14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                    </svg>
                  </a>
                </div>
                
                <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left min-w-0 relative z-10 w-full">
                  <div className="space-y-1 mb-4 md:mb-6 flex flex-col items-center md:items-start">
                    <h3 className="text-2xl font-bold tracking-tight uppercase leading-none transition-colors w-full pl-1 whitespace-nowrap text-slate-900 group-hover:text-orange-600">
                      {mentor.name}
                    </h3>
                    <p className="text-[10px] md:text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      {mentor.experience}
                    </p>
                    <div className="w-12 h-1 transition-all duration-500 rounded-full bg-slate-100 group-hover:w-24 group-hover:bg-orange-500"></div>
                  </div>
                  <p className="text-[14px] md:text-[15px] leading-relaxed mb-6 md:mb-8 line-clamp-2 font-medium text-slate-500">
                    {mentor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsSection;
