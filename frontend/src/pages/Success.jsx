// pages/Success.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const orderDetails = location.state?.orderDetails;

  // Trigger confetti on page load
  useEffect(() => {
    // Fire confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
    });
    
    // Second burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.7 },
        startVelocity: 25,
      });
    }, 200);
  }, []);

  const user = localStorage.getItem("user");
  const userdata = JSON.parse(user);
  // Countdown redirect
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const handleRedirectNow = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate(`/cart/${userdata.id}`);
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-green-500/30 animate-fade-in-up">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Thank you for your order. Your food will be delivered soon!
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
              
              {/* Order ID */}
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
                <span className="text-gray-400">Order ID:</span>
                <span className="text-green-400 font-mono font-bold">{orderDetails.orderId}</span>
              </div>
              
              {/* Customer Name */}
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
                <span className="text-gray-400">Customer:</span>
                <span className="text-white font-medium">{orderDetails.userName || "Guest"}</span>
              </div>
              
              {/* Items */}
              <div className="mb-3 pb-3 border-b border-gray-700">
                <span className="text-gray-400 block mb-2">Items:</span>
                <div className="space-y-2">
                  {orderDetails.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-white">{item.foodDetails?.name} × {item.quantity}</span>
                      <span className="text-green-400">₹{(item.foodDetails?.price || 0) * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
                <span className="text-gray-400">Payment Method:</span>
                <span className="text-white font-medium">
                  {orderDetails.paymentMethod === "COD" ? "Cash on Delivery" : "QR Payment"}
                </span>
              </div>
              
              {/* Total */}
              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-400 font-bold">Total Amount:</span>
                <span className="text-green-400 font-bold text-xl">₹{orderDetails.total?.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Estimated Delivery Time */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-300">Estimated Delivery Time: <span className="text-green-400 font-bold">30-45 minutes</span></span>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center mb-8">
            <p className="text-gray-400 mb-2">
              Redirecting to home page in
            </p>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
              <span className="text-2xl font-bold text-white">{countdown}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">seconds</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRedirectNow}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all transform hover:scale-105"
            >
              Go to Home Now
            </button>
            <button
              onClick={handleViewOrders}
              className="px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
            >
              View My Orders
            </button>
          </div>

          {/* Share Section */}
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm mb-3">Share your order with friends!</p>
            <div className="flex justify-center gap-3">
              <button className="p-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-all">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </button>
              <button className="p-2 bg-green-600/20 rounded-lg hover:bg-green-600/30 transition-all">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Success;