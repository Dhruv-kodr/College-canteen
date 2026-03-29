// pages/admin/AdminOrders.jsx - Simple Working Version
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ChevronLeft, ChevronRight, RefreshCw, Search, Filter, X, Package, Clock, CheckCircle, XCircle, TrendingUp, DollarSign, User, Phone, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', page: 1, search: '', startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch orders function
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page);
      params.append('limit', 10);
      
      const response = await axios.get(`http://localhost:3000/api/food/admin/orders?${params}`, {
        withCredentials: true
      });
      
      console.log("API Response:", response.data);
      
      setOrders(response.data.orders || []);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    // Optimistic update
    const oldOrders = [...orders];
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
    
    try {
      await axios.put(
        `http://localhost:3000/api/food/admin/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders(); // Refresh to get latest stats
    } catch (error) {
      setOrders(oldOrders);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters.status, filters.page, filters.search, filters.startDate, filters.endDate]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'delivered': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statCards = [
    { title: 'Total Orders', value: stats?.total || 0, icon: Package, bg: 'bg-blue-500' },
    { title: 'Pending', value: stats?.pending || 0, icon: Clock, bg: 'bg-yellow-500' },
    { title: 'Confirmed', value: stats?.confirmed || 0, icon: CheckCircle, bg: 'bg-green-500' },
    { title: 'Completed', value: stats?.completed || 0, icon: TrendingUp, bg: 'bg-purple-500' },
    { title: 'Delivered', value: stats?.delivered || 0, icon: CheckCircle, bg: 'bg-emerald-500' },
    { title: 'Cancelled', value: stats?.cancelled || 0, icon: XCircle, bg: 'bg-red-500' },
    { title: 'Revenue', value: `₹${stats?.totalRevenue?.[0]?.total || 0}`, icon: DollarSign, bg: 'bg-green-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
            <p className="text-gray-600">Manage and track all customer orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-xl shadow-md p-4 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-6 w-6 opacity-80" />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm opacity-90">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID or Customer Name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-gray-800">No orders found</h2>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-500 text-sm">Order ID:</span>
                      <span className="text-gray-800 font-mono font-bold">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={updating}
                      className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer ${getStatusStyle(order.status)}`}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="completed">👨‍🍳 Completed</option>
                      <option value="delivered">🎉 Delivered</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{order.totalPrice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{order.userId?.name || 'Guest'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{order.userId?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Qty: {order.quantity}</span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  className="mt-3 text-sm text-green-600 hover:text-green-700"
                >
                  {expandedOrder === order._id ? 'Show Less' : 'View Details'}
                </button>

                {expandedOrder === order._id && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex gap-3">
                      <img
                        src={`http://localhost:3000/${order.foodId?.image}`}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                        alt=""
                      />
                      <div>
                        <h4 className="font-semibold">{order.foodId?.name}</h4>
                        <p className="text-gray-600 text-sm">{order.foodId?.description}</p>
                        <p className="text-green-600 font-bold mt-1">₹{order.foodId?.price}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 bg-green-600 text-white rounded-lg">
              Page {filters.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === pagination.totalPages}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;