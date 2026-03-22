// pages/Checkout.jsx
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { DataContext } from "../contexts/DataContext";


const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const { setCartItems } = useContext(DataContext)

  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch full food details for items
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!state?.items || state.items.length === 0) {
        toast.error("No items to checkout");
        navigate("/menu");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/api/food/get-food");
        const allFoods = response.data;
        
        // Map items with full details
        const detailedItems = state.items.map(item => {
          const food = allFoods.find(f => f._id === item.foodId);
          return {
            ...item,
            foodDetails: food,
            selected: true // Default selected
          };
        });
        
        setItemsData(detailedItems);
        // Initially select all items
        setSelectedItems(detailedItems);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load item details");
      }
    };

    fetchItemDetails();
  }, [state, navigate]);

  // Toggle item selection
  const toggleItemSelection = (foodId) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(item => item.foodId === foodId);
      if (isSelected) {
        return prev.filter(item => item.foodId !== foodId);
      } else {
        const itemToAdd = itemsData.find(item => item.foodId === foodId);
        return [...prev, itemToAdd];
      }
    });
  };

  // Select/Deselect all
  const toggleSelectAll = () => {
    if (selectedItems.length === itemsData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...itemsData]);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = selectedItems.reduce((total, item) => {
      return total + (item.foodDetails?.price || 0) * item.quantity;
    }, 0);
    
    const deliveryFee = 0;
    const tax = subtotal * 0.05;
    const grandTotal = subtotal + deliveryFee + tax;
    
    return { subtotal, deliveryFee, tax, grandTotal };
  };

  const { subtotal, deliveryFee, tax, grandTotal } = calculateTotals();

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Please select at least one item");
      return;
    }

    setLoading(true);
    try {
      // Send only selected items to backend
      const orderItems = selectedItems.map(item => ({
        foodId: item.foodId,
        quantity: item.quantity
      }));

      const response = await axios.post(
        "http://localhost:3000/api/food/buy-all",
        { items: orderItems },
        { withCredentials: true }
      );
      setCartItems(prev =>
  prev.filter(
    cartItem =>
      !selectedItems.some(i => i.foodId === cartItem.foodId._id)
  )
);

      toast.success("Order placed successfully!");
      // Pass order details to success page
      navigate("/success", { 
        state: { 
          orderDetails: {
            orderId: response.data.orderId || `ORD${Date.now()}`,
            items: selectedItems,
            total: grandTotal,
            paymentMethod: paymentMethod,
            userName: user?.name
          }
        }
      });
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (itemsData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        
               <Toaster position="bottom-right" />
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/cart/${user.id}`} 
            state={{ userId: user?._id }} // Pass user ID back to cart
            className="text-green-400 hover:text-green-300 mb-4 inline-flex items-center gap-2 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Cart
          </Link>
          
          {/* User Greeting */}
          {user && (
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 mb-6">
              <p className="text-gray-300">
                <span className="text-green-400">👋 Hello, {user.name || "Guest"}!</span>
                <span className="text-gray-500 ml-2">(ID: {user.id})</span>
              </p>
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold text-white">Checkout</h1>
          <p className="text-gray-400 mt-2">Review and confirm your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select All Button */}
            <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedItems.length === itemsData.length && selectedItems.length > 0
                    ? "bg-green-500 border-green-500"
                    : "border-gray-500"
                }`}>
                  {selectedItems.length === itemsData.length && selectedItems.length > 0 && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span>Select All Items</span>
              </button>
              <span className="text-gray-400 text-sm">
                {selectedItems.length} of {itemsData.length} selected
              </span>
            </div>

            {/* Items List */}
            {itemsData.map((item) => (
              <div
                key={item.foodId}
                className={`bg-gray-900 rounded-2xl p-4 flex gap-4 transition-all ${
                  selectedItems.some(i => i.foodId === item.foodId)
                    ? "border-2 border-green-500 shadow-lg shadow-green-500/20"
                    : "border-2 border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {/* Checkbox */}
                <div className="flex items-start">
                  <button
                    onClick={() => toggleItemSelection(item.foodId)}
                    className="mt-1"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedItems.some(i => i.foodId === item.foodId)
                        ? "bg-green-500 border-green-500"
                        : "border-gray-500"
                    }`}>
                      {selectedItems.some(i => i.foodId === item.foodId) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>

                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={`http://localhost:3000/${item.foodDetails?.image}`}
                    alt={item.foodDetails?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {item.foodDetails?.name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                        {item.foodDetails?.description || "Delicious food item"}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-green-400 font-medium">
                          ₹{item.foodDetails?.price}
                        </span>
                        <span className="text-gray-500">×</span>
                        <span className="text-white font-medium">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">
                        ₹{(item.foodDetails?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-300">
                  <span>Items Selected</span>
                  <span className="font-medium">{selectedItems.length}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
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

              {/* Payment Methods */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">
                  Select Payment Method
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("COD")}
                    className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                      paymentMethod === "COD"
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💵</span>
                      <span className="text-white font-medium">Cash on Delivery</span>
                    </div>
                    {paymentMethod === "COD" && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod("QR")}
                    className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                      paymentMethod === "QR"
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <span className="text-white font-medium">QR Payment</span>
                    </div>
                    {paymentMethod === "QR" && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handlePayment}
                disabled={loading || selectedItems.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Confirm Order • ₹${grandTotal.toFixed(2)}`
                )}
              </button>

              <p className="text-gray-500 text-xs text-center">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;