// pages/Orders.jsx
import React, { useEffect, useContext, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import Navbar from "../components/home/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Orders = () => {

  const navigate = useNavigate();

useEffect(() => {
      const token = localStorage.getItem("token")
  
      if (!token ) {
        navigate("/login")
      }
  
    }, [navigate])

  const { orders, myOrders, loading, ordersLoading, cancelOrder } = useContext(DataContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    myOrders();
  }, [myOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "confirmed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "delivered":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "confirmed":
        return "✅";
      case "completed":
        return "👨‍🍳";
      case "delivered":
        return "🎉";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Confirmation";
      case "confirmed":
        return "Order Confirmed";
      case "completed":
        return "Order Completed";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setCancellingOrderId(orderId);
        await cancelOrder(orderId);
        // Refresh orders after cancellation
        await myOrders();
      } catch (error) {
        console.error("Error cancelling order:", error);
      } finally {
        setCancellingOrderId(null);
      }
    }
  };

  // Filter orders based on status
  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Calculate order statistics
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const cancelledOrders = orders.filter(o => o.status === "cancelled").length;
  const totalSpent = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  if (loading || ordersLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="bg-amber-600">
        <Navbar />
      </div>
      
      <div className="min-h-screen bg-gray-950 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              My Orders
            </h1>
            <p className="text-gray-400">
              Track and manage all your orders in one place
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{totalOrders}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Delivered</p>
                  <p className="text-2xl font-bold text-green-400">{deliveredOrders}</p>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{pendingOrders}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Cancelled</p>
                  <p className="text-2xl font-bold text-red-400">{cancelledOrders}</p>
                </div>
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">❌</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-green-400">₹{totalSpent}</p>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "all"
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("confirmed")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "confirmed"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus("delivered")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "delivered"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setFilterStatus("cancelled")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === "cancelled"
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                No orders found
              </h2>
              <p className="text-gray-400 mb-6">
                {filterStatus !== "all" 
                  ? `You don't have any ${filterStatus} orders` 
                  : "You haven't placed any orders yet"}
              </p>
              <Link
                to="/menu"
                className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-green-500/30 transition-all"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-900 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-500/10 transition-all border border-gray-800 hover:border-green-500/30"
                >
                  <div className="p-5">
                    {/* Order Header */}
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-400 text-sm">Order ID:</span>
                          <span className="text-white font-mono text-sm">
                            {order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {getStatusText(order.status)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Order Total */}
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="text-2xl font-bold text-green-400">
                          ₹{order.totalPrice}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-800 pt-4">
                      {/* Check if order has multiple items */}
                      {order.items && order.items.length > 0 ? (
                        // Multiple items in order
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                <img
                                  src={`http://localhost:3000/${item.foodId?.image}`}
                                  alt={item.foodId?.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-white font-semibold">
                                      {item.foodId?.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                      Quantity: {item.quantity}
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                      Price: ₹{item.foodId?.price} each
                                    </p>
                                  </div>
                                  <p className="text-green-400 font-medium">
                                    ₹{(item.foodId?.price || 0) * item.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Show total items count */}
                          <div className="text-right text-gray-400 text-sm pt-2 border-t border-gray-800">
                            Total Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                          </div>
                        </div>
                      ) : (
                        // Single item order
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                            <img
                              src={`http://localhost:3000/${order.foodId?.image}`}
                              alt={order.foodId?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-1">
                              {order.foodId?.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                              {order.foodId?.description || "Delicious food item prepared with fresh ingredients"}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">Price:</span>
                                  <span className="text-green-400 font-medium">
                                    ₹{order.foodId?.price}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">Quantity:</span>
                                  <span className="text-white font-medium">
                                    {order.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-sm">Item Total</p>
                                <p className="text-white font-bold">
                                  ₹{(order.foodId?.price || 0) * order.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Details - Only show for non-delivered and non-cancelled orders */}
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Estimated Delivery:</span>
                            <span className="text-green-400 font-medium">
                              {new Date(new Date(order.createdAt).getTime() + 45 * 60000).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="text-gray-500">(30-45 mins)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cancellation Reason (if cancelled) */}
                    {order.status === "cancelled" && order.cancelledAt && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-red-400">Cancelled on:</span>
                            <span className="text-gray-300">
                              {new Date(order.cancelledAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-800 flex gap-3 flex-wrap">
                      {/* Cancel Order Button - Only show for pending or confirmed orders */}
                      {(order.status === "pending" || order.status === "confirmed") && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingOrderId === order._id}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingOrderId === order._id ? (
                            <>
                              <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                              Cancelling...
                            </>
                          ) : (
                            "Cancel Order"
                          )}
                        </button>
                      )}
                      
                      {/* Rate & Review Button - Only for delivered orders */}
                      {order.status === "delivered" && (
                        <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm">
                          Rate & Review
                        </button>
                      )}
                      
                      {/* View Details Button */}
                      <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm">
                        View Details
                      </button>
                      
                      {/* Reorder Button - Only for delivered orders or completed orders (not cancelled) */}
                      {order.status !== "cancelled" && (
                        <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-all text-sm">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;