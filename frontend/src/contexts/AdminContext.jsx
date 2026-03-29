// contexts/AdminContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Order management states
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderPagination, setOrderPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  /* ---------- FOOD ---------- */
  const getFoods = async () => {
    const res = await axios.get("http://localhost:3000/api/food/get-food", {
      withCredentials: true,
    });
    setFoods(res.data);
  };

  const addFood = async (formData) => {
    try {
      await axios.post("http://localhost:3000/api/food/add-food", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      getFoods();
      toast.success("Food added successfully!");
    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add food");
    }
  };

  const updateFood = async (id, data) => {
    try {
      console.log("Hello")
      const res = await axios.patch(
        `http://localhost:3000/api/food/update-food/${id}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data)
      getFoods();
      toast.success("Food updated successfully!");
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update food");
    }
  };

  const deleteFood = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/food/delete-food/${id}`, {
        withCredentials: true,
      });
      getFoods();
      toast.success("Food deleted successfully!");
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete food");
    }
  };

  /* ---------- USERS ---------- */
  const getUsers = async () => {
    const res = await axios.get("http://localhost:3000/api/auth/get-users", {
      withCredentials: true,
    });
    setUsers(res.data.users);
  };

  const updateUser = async (id, data) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/auth/update-user/${id}`,
        data,
        { withCredentials: true }
      );
      await getUsers();
      toast.success("User updated successfully!");
    } catch (err) {
      console.log("UPDATE USER ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

 const deleteUser = async (id) => {
  try {
    await axios.delete(
      `http://localhost:3000/api/auth/delete-user/${id}`,
      { withCredentials: true }
    );
    
    // Remove user from state
    setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
    
    // Delete user's orders from orders state
    setOrders(prevOrders => prevOrders.filter(order => order.userId?._id !== id));
    
    // Update stats after user deletion
    const userOrders = orders.filter(order => order.userId?._id === id);
    if (userOrders.length > 0 && orderStats) {
      setOrderStats(prevStats => {
        const newStats = { ...prevStats };
        userOrders.forEach(order => {
          newStats[order.status] = (newStats[order.status] || 0) - 1;
          newStats.total = (newStats.total || 0) - 1;
        });
        return newStats;
      });
    }
    
    toast.success("User and associated data deleted successfully!");
  } catch (err) {
    console.log("DELETE ERROR:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to delete user");
  }
};

  /* ---------- ORDERS ---------- */
  
  // Fetch all orders with filters
  const fetchOrders = async (filters = {}) => {
    try {
      setOrdersLoading(true);
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await axios.get(`http://localhost:3000/api/food/admin/orders?${params}`, {
        withCredentials: true
      });
      
      setOrders(response.data.orders);
      setOrderStats(response.data.stats);
      setOrderPagination(response.data.pagination);
      return response.data;
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      throw error;
    } finally {
      setOrdersLoading(false);
    }
  };

  // Update single order status
const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/food/admin/orders/${orderId}/status`,
      { status },
      { withCredentials: true }
    );
    
    // IMPORTANT: Directly update orders state
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => {
        if (order._id === orderId) {
          return { ...order, status: status };
        }
        return order;
      });
      return updatedOrders;
    });
    
    // Update stats also
    if (orderStats) {
      const oldOrder = orders.find(o => o._id === orderId);
      if (oldOrder && oldOrder.status !== status) {
        setOrderStats(prev => ({
          ...prev,
          [oldOrder.status]: Math.max(0, (prev[oldOrder.status] || 0) - 1),
          [status]: (prev[status] || 0) + 1
        }));
      }
    }
    
    toast.success(`Order status updated to ${status}`);
    return response.data;
  } catch (error) {
    console.error("Update order status error:", error);
    toast.error(error.response?.data?.message || "Failed to update status");
    throw error;
  }
};

// Bulk update - FIXED REAL-TIME UPDATE
const bulkUpdateOrderStatus = async (orderIds, status) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/food/admin/orders/bulk-status`,
      { orderIds, status },
      { withCredentials: true }
    );
    
    // Update all selected orders in state
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (orderIds.includes(order._id)) {
          return { ...order, status: status };
        }
        return order;
      });
    });
    
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.error("Bulk update error:", error);
    toast.error(error.response?.data?.message || "Failed to update orders");
    throw error;
  }
};


  // Fetch order statistics
  const fetchOrderStats = async (period = 'today') => {
    try {
      const response = await axios.get(`http://localhost:3000/api/food/admin/orders/stats?period=${period}`, {
        withCredentials: true
      });
      setOrderStats(response.data.stats);
      return response.data;
    } catch (error) {
      console.error("Fetch stats error:", error);
      throw error;
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`http://localhost:3000/api/food/admin/orders/${orderId}`, {
      withCredentials: true
    });
    
    // Remove from state
    const deletedOrder = orders.find(o => o._id === orderId);
    setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    
    // Update stats
    if (deletedOrder) {
      setOrderStats(prevStats => {
        if (!prevStats) return prevStats;
        const newStats = { ...prevStats };
        newStats[deletedOrder.status] = (newStats[deletedOrder.status] || 0) - 1;
        newStats.total = (newStats.total || 0) - 1;
        return newStats;
      });
    }
    
    toast.success("Order deleted successfully");
  } catch (error) {
    console.error("Delete order error:", error);
    toast.error(error.response?.data?.message || "Failed to delete order");
    throw error;
  }
};


  useEffect(() => {
    getFoods();
    getUsers();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        // Food management
        foods,
        addFood,
        updateFood,
        deleteFood,
        getFoods,
        
        // User management
        users,
        getUsers,
        updateUser,
        deleteUser,
        
        // Order management
        orders,
        orderStats,
        ordersLoading,
        orderPagination,
        fetchOrders,
        updateOrderStatus,
        bulkUpdateOrderStatus,
        fetchOrderStats,
        deleteOrder,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;