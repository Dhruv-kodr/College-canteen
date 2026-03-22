// pages/Cart.jsx
import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DataContext } from "../contexts/DataContext";
import Navbar from "../components/home/Navbar";
import Footer from "../components/Footer";
import {Toaster } from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartLoading,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
  } = useContext(DataContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();
  const deliveryFee = 0;
  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + deliveryFee + tax;

 const handleBuyAll = () => {
  navigate("/checkout", {
    state: {
      items: cartItems.map(item => ({
        foodId: item.foodId._id,
        quantity: item.quantity
      }))
    }
  });
};

  if (cartLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    <div className="bg-amber-700">
       <Toaster position="bottom-right" />
      <Navbar  />
      </div>
      <div className="min-h-screen bg-gray-950 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Your Cart
            </h1>
            <p className="text-gray-400 mt-2">
              Welcome back, {user.name || "Guest"}! You have {cartCount}{" "}
              item{cartCount !== 1 ? "s" : ""} in your cart.
            </p>
          </div>

          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-400 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/menu"
                className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-green-500/30 transition-all"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-gray-900 rounded-2xl p-4 flex gap-4 hover:shadow-lg hover:shadow-green-500/10 transition-all"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={`http://localhost:3000/${item.foodId?.image}`}
                        alt={item.foodId?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 className="text-white font-bold text-lg">
                            {item.foodId?.name}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                            {item.foodId?.description || "Delicious food item"}
                          </p>
                          <p className="text-green-400 font-bold mt-2">
                            ₹{item.foodId?.price} x {item.quantity} = ₹
                            {item.foodId?.price * item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.foodId?._id)}
                          className="text-red-500 hover:text-red-400 transition-colors p-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => decreaseQuantity(item.foodId?._id)}
                          className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition-all"
                        >
                          -
                        </button>
                        <span className="text-white font-bold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.foodId?._id)}
                          className="w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({cartCount} items)</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax (5%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-700 my-3"></div>
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-400">
                        ₹{grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBuyAll}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/menu"
                    className="block text-center text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;