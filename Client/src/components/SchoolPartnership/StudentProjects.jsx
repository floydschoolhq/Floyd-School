const StudentProjects = () => {
  const projects = [
    {
      name: 'Snake Game',
      description: 'A classic Snake game built with modern web technologies — smooth controls, score tracking, and addictive gameplay.',
      category: 'Game Development',
      image: '/projects/snake_game.png',
      link: 'https://snakegame1-nine.vercel.app/',
      tech: ['JavaScript', 'HTML5', 'CSS3'],
      student: {
        name: 'Priya Sharma',
        program: 'Web Dev Bootcamp',
        image: '/assets/girl1-B1PlKgIA.jpg'
      },
      stats: { stars: 142, views: 950 }
    },
    {
      name: 'AI Expense Coach',
      description: 'An AI-powered personal finance coach that helps users track expenses, set budgets, and get smart spending insights.',
      category: 'Full Stack Development',
      image: '/projects/E_commerce.png',
      link: 'https://ai-expense-coach--shansharma.replit.app/',
      tech: ['React', 'Node.js', 'AI API', '+1 more'],
      featured: true,
      student: {
        name: 'Rahul Verma',
        program: 'Full Stack Web Dev',
        image: '/assets/boy1-hVNs9-xq.jpg'
      },
      stats: { stars: 189, views: '1.1k' }
    },
    {
      name: 'Todo App',
      description: 'A clean and intuitive todo application to manage daily tasks with priority levels, deadlines, and progress tracking.',
      category: 'Productivity',
      image: '/projects/task_management.jpg',
      link: 'https://todo-app-delta-one-65.vercel.app/',
      tech: ['React', 'CSS3', 'LocalStorage'],
      student: {
        name: 'Sneha Patel',
        program: 'Web Dev Bootcamp',
        image: '/assets/girl2-FrxMyR6l.avif'
      },
      stats: { stars: 98, views: 620 }
    },
    {
      name: 'School Website',
      description: 'A fully responsive school website featuring course listings, faculty profiles, admissions info, and a modern design.',
      category: 'Web Development',
      image: '/projects/IoT-For-Home-Automation.jpg',
      link: 'https://thinkskool-bootcamp-webdev-project.vercel.app/',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      featured: true,
      student: {
        name: 'Kavya Reddy',
        program: 'Web Dev Bootcamp',
        image: '/assets/girl3-BwaFsbNB.avif'
      },
      stats: { stars: 176, views: '1.4k' }
    },
    {
      name: 'Netflix Clone',
      description: 'A fully functional Netflix clone with movie browsing, trailer playback, user authentication, and personalized recommendations.',
      category: 'Full Stack Development',
      image: '/projects/netflix_clone.png',
      link: 'https://netfixcopy9.vercel.app/',
      tech: ['React', 'Node.js', 'MongoDB', '+2 more'],
      featured: true,
      student: {
        name: 'Vikram Singh',
        program: 'Full Stack Web Dev',
        image: '/assets/boy2-zXUvLf2x.jpg'
      },
      stats: { stars: 342, views: '3.2k' }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-slate-500">
          These are real projects students actually build.
        </h2>
      </div>
      
      <div className="flex justify-center gap-4 mb-12">
        <button className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25">
          All Projects
        </button>
        <button className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200">
          Featured Only
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16 auto-rows-auto">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative group cursor-pointer will-change-transform hover:-translate-y-1 transition-transform duration-300 block ${
              project.featured ? 'lg:col-span-2 lg:row-span-2 md:col-span-1 md:row-span-2' : 'lg:col-span-1 md:row-span-1'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out rounded-2xl"></div>
            <div className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 ease-out ${
              project.featured 
                ? `bg-gradient-to-br from-${project.name === 'AI Expense Coach' ? 'blue' : project.name === 'School Website' ? 'orange' : 'red'}-500/20 to-${project.name === 'AI Expense Coach' ? 'blue' : project.name === 'School Website' ? 'orange' : 'red'}-600/20 border-${project.name === 'AI Expense Coach' ? 'blue' : project.name === 'School Website' ? 'orange' : 'red'}-500/30 border-2 shadow-2xl`
                : 'border-slate-200/60 shadow-lg group-hover:shadow-xl'
            }`}>
              <div className="relative h-48 md:h-56 overflow-hidden bg-slate-100">
                <div 
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url("${project.image}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-800">
                  {project.category}
                </div>
              </div>
              
              <div className="p-8 flex flex-col items-center text-center">
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                  {project.name}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mb-6 max-w-sm">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {project.tech.map((tech, i) => (
                    <div key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code-xml">
                        <path d="m18 16 4-4-4-4"></path>
                        <path d="m6 8-4 4 4 4"></path>
                        <path d="m14.5 4-5 16"></path>
                      </svg>
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform overflow-hidden bg-slate-100">
                      <img alt={project.student.name} className="w-full h-full object-cover" src={project.student.image} />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-slate-900">{project.student.name}</p>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{project.student.program}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="flex items-center gap-1 hover:scale-105 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-yellow-500 fill-yellow-500">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                      </svg>
                      <span className="text-xs font-medium">{project.stats.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span className="text-xs font-medium">{project.stats.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <div className="text-center">
        <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/25 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
          Start Building Your Own Project
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
        <p className="text-slate-600 mt-4">Join our courses and turn your ideas into reality</p>
      </div>
    </div>
  );
};

export default StudentProjects;
