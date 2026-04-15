import { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Aryan',
      class: 'Class 10',
      image: '/assets/boy1-hVNs9-xq.jpg',
      quote: 'Before thinkskool I thought AI was something only PhDs could understand. Now I have a chatbot I built sitting on my laptop.',
      color: 'blue'
    },
    {
      name: 'Priya',
      class: 'Class 9',
      image: '/assets/girl1-B1PlKgIA.jpg',
      quote: 'The mentors push you to think. Every time I got stuck they asked me questions instead of giving me the answer. That changed how I learn.',
      color: 'purple'
    },
    {
      name: 'Rohan',
      class: 'Class 8',
      image: '/assets/boy1-hVNs9-xq.jpg',
      quote: 'I was sure it would be too hard. My IoT device is now sitting on my desk and I programmed the whole thing. Still can\'t believe it.',
      color: 'orange'
    },
    {
      name: 'Parent of Sneha',
      class: 'Class 11',
      image: '/assets/girl2-FrxMyR6l.avif',
      quote: 'Within three weeks my daughter was explaining machine learning concepts to me at dinner. The confidence shift was remarkable.',
      color: 'cyan',
      isParent: true
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const cardWidth = 350;
  const gap = 24;
  const cardsPerView = window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const maxIndex = testimonials.length - cardsPerView;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isDragging, maxIndex]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setTranslateX(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(translateX) > 50) {
      if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (translateX < 0 && currentIndex < maxIndex) {
        setCurrentIndex(currentIndex + 1);
      }
    }
    setTranslateX(0);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Student Voices
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-slate-900 mb-4">
            Real Students. Real Impact.
          </h2>
        </div>

        <div className="relative">
          <div 
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-[350px] rounded-2xl h-[400px] p-6 md:p-8 pb-10 md:pb-12 group relative transition-all duration-700 overflow-hidden border backdrop-blur-2xl flex flex-col items-center text-center bg-white border-slate-200 shadow-xl flex-shrink-0"
                >
                  <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 bg-${testimonial.color}-500/10`}></div>
                  <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10 flex flex-col items-center w-full">
                    <div className="relative mb-6 md:mb-8 pt-2">
                      <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-${testimonial.color}-500/10`}></div>
                      <div className="relative p-1 rounded-2xl border border-slate-200 group-hover:border-slate-300 bg-gradient-to-b from-white to-slate-50">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-transform duration-700 group-hover:scale-105 bg-slate-100">
                          <img alt={testimonial.name} className="w-full h-full object-cover" src={testimonial.image} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-base md:text-xl font-bold tracking-tight mb-1 text-slate-900">
                        {testimonial.name}
                      </h4>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] bg-${testimonial.color}-100 text-${testimonial.color}-600`}>
                        {testimonial.isParent ? 'Parent of' : 'Student'}, {testimonial.class}
                      </div>
                    </div>
                    
                    <div className="relative px-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-quote absolute -top-4 -left-1 opacity-[0.03] text-slate-900">
                        <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                        <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                      </svg>
                      <p className="text-[12px] md:text-[15px] leading-relaxed font-medium italic mb-4 relative z-10 text-slate-600 group-hover:text-slate-900">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
