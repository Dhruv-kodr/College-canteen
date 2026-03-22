import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../contexts/DataContext";
import FoodCard from "./FoodCard"; // ✅ FIXED - FoodCard home folder me hai
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../Footer";
import NewsLetter from "./NewsLetter";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const FoodItem_1 = () => {
  const { foodData } = useContext(DataContext);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState("veg");
  const [loading, setLoading] = useState(true);

  const hero = useRef();
  const slider = useRef();
  const cards = useRef();
  const floatingFoods = useRef([]);
  const categoryRefs = useRef([]);
  const particlesRef = useRef();
  const wordsContainer = useRef();

  // Loading state
  useEffect(() => {
    if (foodData && foodData.length > 0) {
      setLoading(false);
    }
  }, [foodData]);

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // MAIN ANIMATION EFFECT - SIMPLIFIED
  useEffect(() => {
    if (!hero.current || !cards.current || !foodData) return;

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    const timer = setTimeout(() => {
      // Create particles
      if (particlesRef.current) {
        particlesRef.current.innerHTML = "";
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div");
          particle.className = "particle";
          particle.style.left = Math.random() * 100 + "%";
          particle.style.top = Math.random() * 100 + "%";
          particle.style.animationDelay = Math.random() * 5 + "s";
          particle.style.width = Math.random() * 5 + 2 + "px";
          particle.style.height = particle.style.width;
          particlesRef.current?.appendChild(particle);
        }
      }

      // Horizontal scroll animation
      if (slider.current && cards.current) {
        const sliderWidth = slider.current.scrollWidth;
        const containerWidth = cards.current.offsetWidth;
        const moveDistance = -(sliderWidth - containerWidth);

        gsap.to(slider.current, {
          x: moveDistance,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: cards.current,
            start: "top top",
            end: () => `+=${sliderWidth * 0.8}`,
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Hero text animations
      gsap.fromTo(
        ".hero-text",
        { y: 150, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "back.out(1.2)",
        },
      );

      gsap.fromTo(
        ".hero-subtitle",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power3.out" },
      );

      // Floating food animations
      floatingFoods.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            y: "+=40",
            x: "+=20",
            rotation: index % 2 === 0 ? 15 : -15,
            duration: 3 + index,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      });

      // Card animations
      const foodCards = document.querySelectorAll(".food-card");
      if (foodCards.length > 0) {
        gsap.fromTo(
          foodCards,
          {
            scale: 0.6,
            opacity: 0,
            y: 100,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: ".category-section",
              start: "top 80%",
            },
          },
        );
      }

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    }, 300);

    return () => {
      clearTimeout(timer);
      floatingFoods.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [foodData]);

  // Parallax effect
  useEffect(() => {
    if (floatingFoods.current) {
      floatingFoods.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            x: mousePosition.x * (index + 1),
            y: mousePosition.y * (index + 1),
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    }
  }, [mousePosition]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollWords = [
    "Fresh",
    "Delicious",
    "Tasty",
    "Spicy",
    "Healthy",
    "Crispy",
    "Hot",
  ];

  const categories = [
    {
      name: "veg",
      title: "🌱 Fresh Veggies",
      color: "green",
      bgImage:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600",
    },
    {
      name: "fastfood",
      title: "⚡ Fast & Tasty",
      color: "yellow",
      bgImage:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1600",
    },
    {
      name: "nonVeg",
      title: "🍗 Non-Veg Feast",
      color: "red",
      bgImage:
        "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=1600",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-full bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading delicious food...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white overflow-x-hidden relative">
      <div ref={particlesRef} className="particles-container" />

      <style jsx>{`
        .pin-spacer {
          pointer-events: none !important;
        }

        .horizontal-scroll-container {
          pointer-events: none !important;
        }

        .category-section,
        .category-section * {
          pointer-events: auto !important;
          position: relative;
          z-index: 20;
        }
        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }
        .particle {
          position: absolute;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 50%;
          pointer-events: none;
          animation: float-particle 12s infinite ease-in-out;
        }
        @keyframes float-particle {
          0%,
          100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(50px, -30px);
          }
          66% {
            transform: translate(-30px, 50px);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        @keyframes scroll-indicator {
          0%,
          100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(15px);
            opacity: 0.5;
          }
        }
        .animate-scroll {
          animation: scroll-indicator 2s infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .horizontal-scroll-container {
          will-change: transform;
        }

        /* Make sure buttons are clickable */
        .food-card,
        .food-card button,
        .food-card * {
          pointer-events: auto !important;
        }
        .floating-food {
          pointer-events: none !important;
        }
        button {
          cursor: pointer !important;
        }
      `}</style>

      {/* HERO SECTION */}
      <section
        ref={hero}
        className="h-screen flex flex-col justify-center items-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-gray-900 to-red-900/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600')] bg-cover bg-center opacity-5 animate-pulse" />
        </div>

        <img
          ref={(el) => (floatingFoods.current[0] = el)}
          className="floating-food absolute top-20 left-20 w-32 h-32 object-contain animate-bounce-slow"
          src="https://png.pngtree.com/png-clipart/20250125/original/pngtree-mouth-watering-pepperoni-pizza-slice-png-image_20340457.png"
          alt="pizza"
          style={{ pointerEvents: "none" }}
        />
        <img
          ref={(el) => (floatingFoods.current[1] = el)}
          className="floating-food absolute bottom-20 right-20 w-32 h-32 object-contain animate-bounce-slow animation-delay-500"
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200"
          alt="burger"
          style={{ pointerEvents: "none" }}
        />
        <img
          ref={(el) => (floatingFoods.current[2] = el)}
          className="floating-food absolute top-40 right-40 w-28 h-28 object-contain animate-bounce-slow animation-delay-1000"
          src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200"
          alt="fries"
          style={{ pointerEvents: "none" }}
        />
        <img
          ref={(el) => (floatingFoods.current[3] = el)}
          className="floating-food absolute bottom-40 left-40 w-28 h-28 object-contain animate-bounce-slow animation-delay-1500"
          src="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200"
          alt="drink"
          style={{ pointerEvents: "none" }}
        />

        <div className="relative z-10 text-center px-4">
          <h1 className="hero-text text-5xl md:text-8xl font-black mb-4">
            <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              Smart
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
              Canteen
            </span>
          </h1>
          <p className="hero-subtitle mt-6 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Experience the future of dining with our smart, hygienic, and
            delicious food service
          </p>
          <div className="hero-subtitle mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full font-bold text-lg overflow-hidden hover:shadow-2xl hover:shadow-green-500/30 transition-all">
              <span className="relative z-10">Order Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <Link to="/menu" className="px-8 py-4 border-2 border-yellow-500 rounded-full font-bold text-lg hover:bg-yellow-500/10 transition-all hover:scale-105">
              Explore Menu
            </Link> 
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </section>

      {/* HORIZONTAL SCROLL SECTION */}
      <section
        ref={cards}
        className="h-screen overflow-hidden relative bg-gray-950"
      >
        <div
          ref={slider}
          className="horizontal-scroll-container flex h-full items-center justify-start px-10 md:px-20 gap-20 md:gap-40"
          style={{ width: `${(scrollWords.length + 2) * 600}px` }}
        >
          <div
            ref={wordsContainer}
            className="relative text-center h-[400px] w-[400px] md:w-[600px] overflow-visible"
          >
            {scrollWords.map((word, i) => (
              <h1
                key={i}
                className="scroll-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-[150px] font-black"
                style={{
                  color:
                    i === 0
                      ? "#22c55e"
                      : i === 1
                        ? "#eab308"
                        : i === 2
                          ? "#ef4444"
                          : i === 3
                            ? "#a855f7"
                            : i === 4
                              ? "#3b82f6"
                              : i === 5
                                ? "#ec4899"
                                : "#14b8a6",
                  textShadow: "0 0 30px currentColor",
                  opacity: 0,
                  visibility: "hidden",
                }}
              >
                {word}
              </h1>
            ))}
          </div>
          <div className="text-center min-w-[300px] md:min-w-[400px]">
            <h1 className="text-6xl md:text-[150px] font-black text-yellow-500 transform hover:scale-110 transition-transform">
              Yummy
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mt-4">
              Pure Happiness
            </p>
          </div>
          <div className="text-center min-w-[300px] md:min-w-[400px]">
            <h1 className="text-6xl md:text-[150px] font-black text-red-500 transform hover:scale-110 transition-transform">
              Tasty
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mt-4">
              Irresistible Flavors
            </p>
          </div>
        </div>
      </section>

     

      {/* FOOD CATEGORIES */}
      {categories.map((cat, i) => (
        <section
          key={i}
          ref={(el) => (categoryRefs.current[i] = el)}
          className="category-section relative z-50 py-20 px-6  overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.85)), url(${cat.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="category-title container mx-auto mb-12 px-4">
            <h2
              className="text-3xl md:text-5xl font-bold inline-block border-b-4 pb-4"
              style={{
                borderColor:
                  cat.color === "green"
                    ? "#22c55e"
                    : cat.color === "yellow"
                      ? "#eab308"
                      : "#ef4444",
              }}
            >
              {cat.title}
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl">
              Discover our delicious range of {cat.name} food items prepared
              with love and care
            </p>
          </div>

          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
            {foodData
              ?.filter((food) => food.category === cat.name)
              .map((food, idx) => (
                <FoodCard
                  key={food._id || idx}
                  food={food}
                  categoryColor={cat.color}
                  categoryName={cat.name}
                />
              ))}
          </div>

          {foodData?.filter((food) => food.category === cat.name).length ===
            0 && (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">
                No items found in this category
              </p>
            </div>
          )}

          <div className="container mx-auto text-center mt-12 px-4">
            <button className="group relative px-8 py-3 bg-gray-800 rounded-full font-bold overflow-hidden hover:shadow-xl transition-all">
              <span className="relative z-10">View More {cat.title}</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  backgroundColor:
                    cat.color === "green"
                      ? "#22c55e"
                      : cat.color === "yellow"
                        ? "#eab308"
                        : "#ef4444",
                }}
              />
            </button>
          </div>
        </section>
      ))}

      <NewsLetter />
      <Footer />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all hover:scale-110 animate-bounce"
      >
        ↑
      </button>
    </div>
  );
};

export default FoodItem_1;
