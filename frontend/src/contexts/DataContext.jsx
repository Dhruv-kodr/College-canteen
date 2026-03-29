// contexts/DataContext.jsx
import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const DataContext = createContext();

const API = "http://localhost:3000/api";

export const DataProvider = ({ children }) => {
  const [foodData, setFoodData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false); // ✅ Added orders loading state

  // Fetch food data
  const fetchFoodData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/food/get-food`);
      setFoodData(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  // Get cart items
  const getCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const res = await axios.get(`${API}/food/get-cart`, {
        withCredentials: true,
      });
      setCartItems(res.data.cartItems || []);
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load cart");
      }
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Get my orders - ✅ IMPROVED with loading state and error handling
  const myOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get(`${API}/food/my-orders`, {
        withCredentials: true
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load orders");
      }
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Add to cart
  const addToCart = async (foodId) => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/food/add-cart`,
        { foodId },
        { withCredentials: true }
      );
      await getCart();
      toast.success("Added to cart!");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  // Increase quantity (same as add to cart)
  const increaseQuantity = async (foodId) => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/food/add-cart`,
        { foodId },
        { withCredentials: true }
      );
      await getCart();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (foodId) => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/food/decrease-cart`,
        { foodId },
        { withCredentials: true }
      );
      await getCart();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (foodId) => {
    try {
      setLoading(true);
      await axios.delete(`${API}/food/removecart`, {
        data: { foodId },
        withCredentials: true,
      });
      await getCart();
      toast.success("Removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  // Buy now - Single item
  const buyNow = async (foodId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API}/food/buy`,
        { foodId, quantity },
        { withCredentials: true }
      );
      
      // ✅ Clear cart for this specific item
      setCartItems(prevItems => 
        prevItems.filter(item => item.foodId?._id !== foodId)
      );
      
      // ✅ Refresh orders after placing order
      await myOrders();
      
      toast.success("Order placed successfully!");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to place order");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Buy all - All items in cart
  const buyAll = async () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/food/buy-all`,
        {
          items: cartItems.map(item => ({
            foodId: item.foodId._id,
            quantity: item.quantity
          }))
        },
        { withCredentials: true }
      );

      // ✅ Clear cart immediately
      setCartItems([]);
      
      // ✅ Refresh orders after placing order
      await myOrders();
      
      // Background sync with server
      getCart().catch(err => console.log("Background sync error:", err));

      toast.success("Order placed successfully!");
      return response.data;

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to place order");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
  try {
    setLoading(true);
    const response = await axios.put(
      `${API}/food/cancel-order/${orderId}`,
      {},
      { withCredentials: true }
    );
    
    // Update orders in state
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId 
          ? { ...order, status: "cancelled" }
          : order
      )
    );
    
    toast.success("Order cancelled successfully!");
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Failed to cancel order");
    throw error;
  } finally {
    setLoading(false);
  }
};

  // ✅ Clear entire cart (useful for checkout)
  const clearCart = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/food/clear-cart`,
        {},
        { withCredentials: true }
      );
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.log(error);
      toast.error("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get cart item quantity for a specific food
  const getCartQuantity = (foodId) => {
    const item = cartItems.find((item) => item.foodId?._id === foodId);
    return item?.quantity || 0;
  };

  // ✅ Check if item is in cart
  const isInCart = (foodId) => {
    return cartItems.some((item) => item.foodId?._id === foodId);
  };

  // ✅ Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.foodId?.price || 0) * item.quantity;
    }, 0);
  };

  // ✅ Get cart item count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // ✅ Get order statistics
  const getOrderStats = useCallback(() => {
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === "delivered").length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    
    return { totalOrders, deliveredOrders, pendingOrders, totalSpent };
  }, [orders]);



  useEffect(() => {
    fetchFoodData();

    const token = document.cookie.includes("token") || localStorage.getItem("token");
    if (token) {
      getCart();
      myOrders();
    }
  }, [getCart, myOrders]); // ✅ Added myOrders to dependency array

  return (
    <DataContext.Provider
      value={{
        // Data
        foodData,
        cartItems,
        orders,
        
        // Loading states
        loading,
        cartLoading,
        ordersLoading,
        
        // Cart functions
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart, // ✅ Added clearCart
        getCartQuantity,
        isInCart,
        getCartTotal,
        getCartCount,
        setCartItems,
        
        // Order functions
        buyNow,
        buyAll,
        myOrders,
        getOrderStats,
        cancelOrder // ✅ Added order statistics
      }}
    >
      {children}
    </DataContext.Provider>
  );
};