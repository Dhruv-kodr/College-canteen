// components/common/FoodCard.jsx
import React, { useContext, useState } from "react";
import { DataContext } from "../../contexts/DataContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FoodCard = ({ food, categoryColor = "green", categoryName = "" }) => {
  const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    getCartQuantity,
    buyNow,
    loading,
  } = useContext(DataContext);

  const navigate = useNavigate()
  const [isBuying, setIsBuying] = useState(false);
  const quantityInCart = getCartQuantity(food._id); 
  const isInCart = quantityInCart > 0;

  const handleBuyNow = () => {
  navigate("/checkout", {
    state: {
      items: [{ foodId: food._id, quantity: 1 }]
    }
  });
};

  const getColorClasses = () => {
    switch (categoryColor) {
      case "green":
        return {
          bg: "bg-green-500",
          hover: "hover:bg-green-600",
          text: "text-green-400",
          border: "border-green-500",
          shadow: "shadow-green-500/30",
        };
      case "yellow":
        return {
          bg: "bg-yellow-500",
          hover: "hover:bg-yellow-600",
          text: "text-yellow-400",
          border: "border-yellow-500",
          shadow: "shadow-yellow-500/30",
        };
      case "red":
        return {
          bg: "bg-red-500",
          hover: "hover:bg-red-600",
          text: "text-red-400",
          border: "border-red-500",
          shadow: "shadow-red-500/30",
        };
      default:
        return {
          bg: "bg-green-500",
          hover: "hover:bg-green-600",
          text: "text-green-400",
          border: "border-green-500",
          shadow: "shadow-green-500/30",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="food-card group relative bg-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
      {/* Card Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={`http://localhost:3000/${food.image}`}
          alt={food.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />

        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
          ₹{food.price}
        </div>

        {/* Category Badge */}
        <div
          className="absolute bottom-4 left-4 text-white px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-sm"
          style={{ backgroundColor: colors.bg, opacity: 0.9 }}
        >
          {categoryName}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
          {food.name}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {food.description ||
            "Delicious food item prepared with fresh ingredients and love."}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < 4 ? "text-yellow-400" : "text-gray-600"
              } fill-current`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-2">(24 reviews)</span>
        </div>

        {/* Action Buttons */}
        {isInCart ? (
          // Quantity Selector - Shows when item is in cart
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => decreaseQuantity(food._id)}
                className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-xl transition-all duration-300 hover:scale-105 active:scale-95"
                disabled={loading}
              >
                -
              </button>
              <span className="w-12 text-center text-white font-bold text-lg">
                {quantityInCart}
              </span>
              <button
                onClick={() => increaseQuantity(food._id)}
                className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-xl transition-all duration-300 hover:scale-105 active:scale-95"
                disabled={loading}
              >
                +
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={isBuying}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isBuying ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ) : (
          // Normal Buttons - When item not in cart
          <div className="flex gap-3">
            <button
              onClick={handleBuyNow}
              disabled={isBuying}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isBuying ? "Processing..." : "Buy Now"}
            </button>
            <button
              onClick={() => {
                console.log("clicked");
                addToCart(food._id);
              }}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ border: `2px solid ${colors.bg}` }}
      />
    </div>
  );
};

export default FoodCard;
