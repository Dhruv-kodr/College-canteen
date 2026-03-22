import React, { useEffect, useRef, useState } from 'react'
import video from '../../assets/foodYard.mp4'
import Navbar from './Navbar'
import gsap from 'gsap'
import { Link } from 'react-router-dom'

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const heroRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const ctaRef = useRef();
  const floatingElementsRef = useRef([]);
  const overlayRef = useRef();
  const textRevealRef = useRef();
  const statsRef = useRef([]);

  const words = ["Taste", "Freshness", "Quality", "Happiness"];
  const stats = [
    { number: "50+", label: "Dishes" },
    { number: "24/7", label: "Service" },
    { number: "100%", label: "Fresh" },
    { number: "5k+", label: "Customers" }
  ];

  // Track mouse for interactive parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height } = heroRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to center (-1 to 1)
      const x = (clientX / width - 0.5) * 2;
      const y = (clientY / height - 0.5) * 2;
      
      setMousePosition({ x, y });
      
      // Interactive title movement based on mouse
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          x: x * 30,
          y: y * 20,
          rotateX: y * 5,
          rotateY: x * 5,
          duration: 0.8,
          ease: "power2.out"
        });
      }
      
      // Interactive subtitle movement
      if (subtitleRef.current) {
        gsap.to(subtitleRef.current, {
          x: x * -20,
          y: y * -15,
          duration: 0.6,
          ease: "power2.out"
        });
      }
      
      // Floating elements parallax
      floatingElementsRef.current.forEach((el, index) => {
        if (el) {
          const depth = (index + 1) * 10;
          gsap.to(el, {
            x: x * depth,
            y: y * depth,
            duration: 1,
            ease: "power1.out"
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initial animations
  useEffect(() => {
    const tl = gsap.timeline();

    // Video overlay animation
    tl.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.inOut" }
    );

    // Text reveal animation
    tl.fromTo(textRevealRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
      "-=1"
    );

    // Title animation with stagger
    tl.fromTo(titleRef.current,
      { 
        y: 100, 
        opacity: 0,
        rotateY: 20 
      },
      { 
        y: 0, 
        opacity: 1, 
        rotateY: 0,
        duration: 1.2, 
        ease: "back.out(1.7)" 
      },
      "-=0.5"
    );

    // Subtitle animation
    tl.fromTo(subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.8"
    );

    // CTA buttons animation
    tl.fromTo(ctaRef.current.children,
      { 
        scale: 0.8, 
        opacity: 0,
        y: 30 
      },
      { 
        scale: 1, 
        opacity: 1, 
        y: 0,
        stagger: 0.15,
        duration: 0.8, 
        ease: "back.out(1.2)" 
      },
      "-=0.5"
    );

    // Stats animation
    statsRef.current.forEach((stat, index) => {
      tl.fromTo(stat,
        { 
          y: 40, 
          opacity: 0,
          scale: 0.9
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.8, 
          delay: index * 0.1,
          ease: "back.out(1.2)" 
        },
        "-=0.3"
      );
    });

    // Floating elements animation
    floatingElementsRef.current.forEach((el, index) => {
      if (el) {
        // Continuous floating animation
        gsap.to(el, {
          y: "+=20",
          x: index % 2 === 0 ? "+=10" : "-=10",
          rotation: index % 2 === 0 ? 5 : -5,
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    });

    // Rotating words animation
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      
      // Animate the word change
      gsap.to(".rotating-word", {
        y: -20,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.fromTo(".rotating-word",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
          );
        }
      });
    }, 3000);

    return () => clearInterval(wordInterval);
  }, []);

  // Handle mouse enter/leave for CTA buttons
  const handleCtaHover = (e, isEnter) => {
    const button = e.currentTarget;
    gsap.to(button, {
      scale: isEnter ? 1.1 : 1,
      boxShadow: isEnter ? "0 20px 40px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.2)",
      duration: 0.3,
      ease: "power2.out"
    });
    
    // Create ripple effect on hover
    if (isEnter) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      button.appendChild(ripple);
      
      gsap.fromTo(ripple,
        { scale: 0, opacity: 0.5 },
        {
          scale: 4,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => ripple.remove()
        }
      );
    }
  };

  return (
    <div 
      ref={heroRef}
      className='w-full h-screen relative overflow-hidden'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Navbar />
      
      {/* Video Background */}
      <video 
        src={video} 
        autoPlay 
        muted 
        loop 
        className='w-full h-full absolute inset-0 object-cover scale-105'
        style={{
          filter: 'brightness(0.7) contrast(1.1)',
          transform: `scale(1.05) translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
        }}
      />
      
      {/* Dynamic Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
        style={{
          opacity: 0.7 + (Math.abs(mousePosition.x) * 0.1)
        }}
      />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (floatingElementsRef.current[i] = el)}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              boxShadow: '0 0 10px rgba(255,255,255,0.3)'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl">
            {/* Text Reveal Line */}
            <div className="overflow-hidden mb-4">
              <div 
                ref={textRevealRef}
                className="h-1 bg-gradient-to-r from-yellow-400 via-red-400 to-green-400 w-32 origin-left"
              />
            </div>

            {/* Interactive Title */}
            <h1 
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            >
              <span className="text-white block">Experience The</span>
              <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-green-400 bg-clip-text text-transparent flex items-center gap-4">
                Ultimate
                <span className="rotating-word text-white text-4xl md:text-6xl lg:text-7xl">
                  {words[currentWordIndex]}
                </span>
              </span>
            </h1>

            {/* Animated Subtitle */}
            <p 
              ref={subtitleRef}
              className="text-gray-200 text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl leading-relaxed"
            >
              Where every meal tells a story of{' '}
              <span className="text-yellow-400 font-bold relative group">
                freshness
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
              ,{' '}
              <span className="text-red-400 font-bold relative group">
                flavor
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
              , and{' '}
              <span className="text-green-400 font-bold relative group">
                innovation
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </p>

            {/* CTA Buttons */}
            <div 
              ref={ctaRef}
              className="flex flex-wrap gap-6 mb-16"
            >
              <button
                onMouseEnter={(e) => handleCtaHover(e, true)}
                onMouseLeave={(e) => handleCtaHover(e, false)}
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full font-bold text-lg text-white overflow-hidden"
              >
                <span className="relative z-10">Order Now</span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
              
              <button
                onMouseEnter={(e) => handleCtaHover(e, true)}
                onMouseLeave={(e) => handleCtaHover(e, false)}
                className="group relative px-8 py-4 bg-transparent border-2 border-green-400 rounded-full font-bold text-lg text-green-400 hover:text-white transition-colors duration-300 overflow-hidden"
              >
                <Link to='/menu' className="relative z-10">Explore Menu</Link>
                <span className="absolute inset-0 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
              
              <button
                onMouseEnter={(e) => handleCtaHover(e, true)}
                onMouseLeave={(e) => handleCtaHover(e, false)}
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-bold text-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                <span className="relative z-10">Watch Video</span>
                <span className="absolute -inset-1 bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  ref={(el) => (statsRef.current[index] = el)}
                  className="text-center group cursor-pointer"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      y: -10,
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      y: 0,
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                >
                  <div className="relative">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      {stat.number}
                    </div>
                    <div className="text-sm md:text-base text-gray-300 uppercase tracking-wider">
                      {stat.label}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-12 h-0.5 bg-yellow-400 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-red-400 to-green-400 animate-pulse" />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/60 text-sm uppercase tracking-wider">Scroll</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div 
            className="w-1.5 h-3 bg-white rounded-full mt-2 animate-bounce"
            style={{
              animation: 'bounce 2s infinite',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)'
            }}
          />
        </div>
      </div>

      {/* Floating Food Icons (Interactive) */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          ref={(el) => (floatingElementsRef.current[20] = el)}
          className="absolute top-20 left-20 text-6xl opacity-30 rotate-12 hover:opacity-60 transition-opacity duration-300"
        >
          🍔
        </div>
        <div 
          ref={(el) => (floatingElementsRef.current[21] = el)}
          className="absolute bottom-32 right-20 text-7xl opacity-30 -rotate-12 hover:opacity-60 transition-opacity duration-300"
        >
          🍕
        </div>
        <div 
          ref={(el) => (floatingElementsRef.current[22] = el)}
          className="absolute top-40 right-40 text-5xl opacity-30 rotate-45 hover:opacity-60 transition-opacity duration-300"
        >
          🥗
        </div>
      </div>

      {/* Custom CSS for ripple effect */}
      <style jsx>{`
        .ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          pointer-events: none;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Hero