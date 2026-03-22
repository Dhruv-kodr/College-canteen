// Status.jsx
import React, { useState } from 'react'
import { 
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Utensils,
  DollarSign,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

const Status = () => {
  const [refreshing, setRefreshing] = useState(false)

  // Sample real-time data
  const systemStatus = {
    server: 'online',
    database: 'connected',
    api: 'operational',
    lastBackup: '2024-01-15 03:00 AM'
  }

  const liveStats = {
    activeOrders: 23,
    preparing: 12,
    ready: 8,
    delivered: 156,
    todayRevenue: 12450,
    pendingPayments: 2340,
    avgWaitTime: '12 mins',
    tableOccupancy: '65%'
  }

  const recentActivities = [
    { id: 1, action: 'New order received', time: '2 mins ago', status: 'success' },
    { id: 2, action: 'Payment completed', time: '5 mins ago', status: 'success' },
    { id: 3, action: 'Low stock alert: Paneer', time: '10 mins ago', status: 'warning' },
    { id: 4, action: 'Order #1234 ready', time: '15 mins ago', status: 'info' },
  ]

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">System Status</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Server Status</p>
              <p className="text-lg font-semibold text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {systemStatus.server}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Database</p>
              <p className="text-lg font-semibold text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {systemStatus.database}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">API</p>
              <p className="text-lg font-semibold text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {systemStatus.api}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Last Backup</p>
              <p className="text-lg font-semibold text-gray-800">{systemStatus.lastBackup}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Orders</h3>
            <Clock className="h-6 w-6" />
          </div>
          <p className="text-4xl font-bold mb-2">{liveStats.activeOrders}</p>
          <div className="flex justify-between text-sm">
            <span>Preparing: {liveStats.preparing}</span>
            <span>Ready: {liveStats.ready}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today's Revenue</h3>
            <DollarSign className="h-6 w-6" />
          </div>
          <p className="text-4xl font-bold mb-2">₹{liveStats.todayRevenue}</p>
          <p className="text-sm">Pending: ₹{liveStats.pendingPayments}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Average Wait Time</h3>
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-4xl font-bold mb-2">{liveStats.avgWaitTime}</p>
          <p className="text-sm">Table occupancy: {liveStats.tableOccupancy}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Delivered</h3>
            <CheckCircle className="h-6 w-6" />
          </div>
          <p className="text-4xl font-bold mb-2">{liveStats.delivered}</p>
          <p className="text-sm">Today's orders completed</p>
        </div>
      </div>

      {/* Real-time Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {activity.status === 'warning' && (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  {activity.status === 'info' && (
                    <Activity className="h-5 w-5 text-blue-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'success' ? 'bg-green-100 text-green-600' :
                  activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Load */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Load</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Kitchen Load</span>
                <span className="text-sm font-semibold text-gray-800">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Staff Available</span>
                <span className="text-sm font-semibold text-gray-800">12/15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Inventory Status</span>
                <span className="text-sm font-semibold text-gray-800">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-gray-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">45</p>
              <p className="text-xs text-gray-500">Customers waiting</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Utensils className="h-5 w-5 text-gray-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">28</p>
              <p className="text-xs text-gray-500">Items in queue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Status