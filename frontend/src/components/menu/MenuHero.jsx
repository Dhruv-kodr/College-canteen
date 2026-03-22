import React, { useEffect, useRef } from 'react'
import { Utensils, Clock, Star, Truck } from 'lucide-react'
import gsap from 'gsap'

const MenuHero = () => {
  const heroRef = useRef();
  const titleRef = useRef();
  const statsRef = useRef([]);

  const stats = [
    { icon: <Utensils className="w-6 h-6" />, value: "50+", label: "Dishes" },
    { icon: <Clock className="w-6 h-6" />, value: "24/7", label: "Service" },
    { icon: <Star className="w-6 h-6" />, value: "4.8", label: "Rating" },
    { icon: <Truck className="w-6 h-6" />, value: "Free", label: "Delivery" }
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    statsRef.current.forEach((stat, index) => {
      tl.fromTo(stat,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.2)" },
        `-=${index === 0 ? 0.4 : 0.3}`
      );
    });
  }, []);

  return (
    <div ref={heroRef} className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div ref={titleRef} className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              Our Delicious Menu
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Explore our wide range of freshly prepared dishes made with love and the finest ingredients
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={(el) => (statsRef.current[index] = el)}
              className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 group"
            >
              <div className="text-green-400 mb-3 flex justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MenuHero