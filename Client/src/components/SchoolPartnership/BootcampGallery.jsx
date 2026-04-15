const BootcampGallery = () => {
  const galleryImages = [
    { src: "/images/bootcamp-1.jpg", alt: "Students in bootcamp", label: "Students in bootcamp" },
    { src: "/images/bootcamp-2.jpg", alt: "Coding session", label: "Coding session" },
    { src: "/images/bootcamp-4.jpg", alt: "Students around laptop", label: "Students around laptop" },
    { src: "/images/bootcamp-5.jpg", alt: "Robot building", label: "Robot building" },
    { src: "/images/bootcamp-6.jpg", alt: "Team collaboration", label: "Team collaboration" },
    { src: "/images/frontview.jpg", alt: "Classroom view", label: "Classroom view" },
  ];

  return (
    <section className="py-24 px-0 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 px-6">
          <span className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-4 block">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Bootcamp Gallery
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Moments from our hands-on technology bootcamps delivered in schools across the country.
          </p>
        </div>

        {/* Mobile: Horizontal scrollable carousel */}
        <div className="lg:hidden flex overflow-x-auto gap-4 pb-4 snap-x px-2">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center">
              <div className="relative group overflow-hidden rounded-2xl aspect-[4/3] shadow-lg">
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold">{img.label}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop: Professional Grid Gallery */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-4 h-[500px]">
            {/* Column 1 - 2 tall images */}
            <div className="flex flex-col gap-4 h-full">
              <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                <img src="/images/bootcamp-1.jpg" alt="Students in bootcamp" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Students in bootcamp</p></div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                <img src="/images/bootcamp-5.jpg" alt="Robot building" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Robot building</p></div>
                </div>
              </div>
            </div>
            {/* Column 2 - 2 normal images */}
            <div className="flex flex-col gap-4 h-full">
              <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                <img src="/images/bootcamp-2.jpg" alt="Coding session" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Coding session</p></div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                <img src="/images/bootcamp-6.jpg" alt="Team collaboration" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Team collaboration</p></div>
                </div>
              </div>
            </div>
            {/* Column 3 - 2 normal images */}
            <div className="flex flex-col gap-4 h-full">
              <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                <img src="/images/bootcamp-4.jpg" alt="Students around laptop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Students around laptop</p></div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                <img src="/images/frontview.jpg" alt="Classroom view" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Classroom view</p></div>
                </div>
              </div>
            </div>
            {/* Column 4 - 2 tall images */}
            <div className="flex flex-col gap-4 h-full">
              <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                <img src="/images/frontview.jpg" alt="Front view" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Front view</p></div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-2xl shadow-lg flex-1">
                <img src="/images/bootcamp-1.jpg" alt="Bootcamp session" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-white font-semibold">Bootcamp session</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BootcampGallery;
