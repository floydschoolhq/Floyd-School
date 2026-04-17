import { DraggableCard } from "../ui/draggable-card";
import { MoveRight } from "lucide-react";

const BootcampGallery = () => {
  const galleryItems = [
    { src: "/images/bootcamp/adaptive_learning.jpg", alt: "Student group", label: "Student Group" },
    { src: "/images/bootcamp/bootcamp-1.jpg", alt: "Students in bootcamp", label: "Students in Bootcamp" },
    { src: "/images/bootcamp/bootcamp-2.jpg", alt: "Coding session", label: "Coding Session" },
    { src: "/images/bootcamp/bootcamp-4.jpg", alt: "Students around laptop", label: "Team Learning" },
    { src: "/images/bootcamp/bootcamp-5.jpg", alt: "Robot building", label: "Robot Building" },
    { src: "/images/bootcamp/bootcamp-6.jpg", alt: "Team collaboration", label: "Team Collaboration" },
    { src: "/images/bootcamp/frontview.jpg", alt: "Classroom view", label: "Classroom View" },
    { src: "/images/bootcamp/card1.jpg", alt: "Interactive learning", label: "Interactive Learning" },
    { src: "/images/bootcamp/card2.jpg", alt: "Tech workshop", label: "Tech Workshop" },
    { src: "/images/bootcamp/1.jpeg", alt: "Live mentorship", label: "Live Mentorship" },
    { src: "/images/bootcamp/cloud_ide.jpg", alt: "Interactive lab", label: "Interactive Lab" },
  ];

  return (
    <section className="py-12 px-0 bg-slate-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 mb-4 tracking-tight">
            Bootcamp Gallery
          </h2>
        </div>

        {/* Mobile: Horizontal scrollable carousel */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory px-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {galleryItems.map((img, idx) => (
              <div key={idx} className="flex-shrink-0 w-[90vw] max-w-[400px] snap-center">
                <div className="relative group overflow-hidden rounded-xl aspect-[4/5] shadow-xl border border-slate-200/50 bg-white">
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop: Draggable stacked cards */}
        <div className="hidden lg:block relative">
          <DraggableCard items={galleryItems} />
        </div>
      </div>
    </section>
  );
};

export default BootcampGallery;