// Dashboard.jsx
import React, { useContext } from 'react'
import { AdminContext } from '../../contexts/AdminContext'
import { 
  Utensils, 
  Users, 
  Star, 
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react'

const Dashboard = () => {
  const { foods, users } = useContext(AdminContext)

  const stats = [
    { 
      label: 'Total Foods', 
      value: foods.length, 
      icon: Utensils, 
      color: 'bg-blue-500',
      trend: '+12%'
    },
    { 
      label: 'Total Users', 
      value: users.length, 
      icon: Users, 
      color: 'bg-green-500',
      trend: '+8%'
    },
    { 
      label: 'Avg Rating', 
      value: '4.5', 
      icon: Star, 
      color: 'bg-yellow-500',
      trend: '+0.3'
    },
    { 
      label: 'Today\'s Orders', 
      value: '156', 
      icon: Clock, 
      color: 'bg-purple-500',
      trend: '+23%'
    },
  ]

  const recentFoods = foods.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  <p className="text-green-500 text-sm mt-2">{stat.trend} from last month</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Foods & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Foods */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recently Added Foods</h2>
          <div className="space-y-3">
            {recentFoods.map((food, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src={food.image ? `http://localhost:3000/${food.image}` : 'https://via.placeholder.com/50'} 
                    alt={food.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{food.name}</p>
                    <p className="text-sm text-gray-500">₹{food.price}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                  {food.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">New order received</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Food item updated: Pasta</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Items Today</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {foods.slice(0, 4).map((food, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <Utensils className="h-8 w-8 text-orange-600" />
              </div>
              <p className="font-semibold text-gray-800">{food.name}</p>
              <p className="text-sm text-gray-500">{food.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard