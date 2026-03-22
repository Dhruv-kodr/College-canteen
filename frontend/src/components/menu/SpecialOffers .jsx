import React, { useContext, useEffect, useRef } from 'react'
import { DataContext } from '../../contexts/DataContext'
import { Tag, Clock, Percent } from 'lucide-react'
import gsap from 'gsap'

const SpecialOffers = () => {
  const { foodData } = useContext(DataContext);
  const offersRef = useRef();
  const cardsRef = useRef([]);

  // Get random items for offers
  const getOffers = () => {
    if (!foodData) return [];
    const shuffled = [...foodData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(item => ({
      ...item,
      discount: Math.floor(Math.random() * 30) + 10,
      originalPrice: item.price,
      discountedPrice: Math.floor(item.price * (1 - (Math.random() * 0.3 + 0.1) / 100))
    }));
  };

  const offers = getOffers();

  useEffect(() => {
    if (offersRef.current) {
      gsap.fromTo(offersRef.current,
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1,
          scrollTrigger: {
            trigger: offersRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1
          }
        }
      );
    }

    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          { scale: 0.8, opacity: 0, x: index % 2 === 0 ? -100 : 100 },
          {
            scale: 1,
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 50%"
            }
          }
        );
      }
    });
  }, []);

  return (
    <div ref={offersRef} className="py-20 px-6 bg-gradient-to-r from-green-900/20 via-yellow-900/20 to-red-900/20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full mb-4">
            <Percent className="w-5 h-5" />
            <span className="font-bold">Limited Time Offers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Today's <span className="text-yellow-400">Special</span> Deals
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Grab these amazing offers before they're gone!
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={offer._id || index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="relative group"
            >
              {/* Discount Badge */}
              <div className="absolute -top-4 -right-4 z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-full shadow-2xl">
                    <span className="text-lg">{offer.discount}% OFF</span>
                  </div>
                </div>
              </div>

              {/* Card */}
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-yellow-500/50 transition-all duration-500">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`http://localhost:3000/${offer.image}`}
                    alt={offer.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  
                  {/* Timer */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">2h 30m left</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {offer.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    {offer.description?.slice(0, 60)}...
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-yellow-400">
                      ₹{offer.discountedPrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{offer.originalPrice}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Sold: 45</span>
                      <span>Available: 20</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                        style={{ width: '70%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Order Button */}
                  <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-3 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Grab This Offer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpecialOffers