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

  // Fetch food data
  const fetchFoodData = async () => {
    try {
      const response = await axios.get(`${API}/food/get-food`);
      setFoodData(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load food items");
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
      await axios.post(
        `${API}/food/add-cart`,
        { foodId },
        { withCredentials: true }
      );
      await getCart();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (foodId) => {
    try {
      await axios.post(
        `${API}/food/decrease-cart`,
        { foodId },
        { withCredentials: true }
      );
      await getCart();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  };

  // Remove from cart
  const removeFromCart = async (foodId) => {
    try {
      await axios.delete(`${API}/food/removecart`, {
        data: { foodId },
        withCredentials: true,
      });
      await getCart();
      toast.success("Removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
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
      // Option 1: Remove only the bought item from cart
      setCartItems(prevItems => 
        prevItems.filter(item => item.foodId?._id !== foodId)
      );
      
      // Option 2: Or refetch cart to sync with server (choose one)
      // await getCart();
      
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

      // ✅ Clear cart immediately without waiting for server
      setCartItems([]);
      
      // Optional: Sync with server in background
      // Don't await this - let it happen in background
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

  useEffect(() => {
    fetchFoodData();
    const token = document.cookie.includes("token");
    if (token) {
      getCart();
    }
  }, [getCart]);

  return (
    <DataContext.Provider
      value={{
        foodData,
        cartItems,
        cartLoading,
        loading,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        buyNow,
        buyAll,
        getCartQuantity,
        isInCart,
        getCartTotal,
        getCartCount,
        setCartItems
      }}
    >
      {children}
    </DataContext.Provider>
  );
};