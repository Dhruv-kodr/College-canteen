// Sidebar.jsx
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Users, 
  Menu, 
  MessageSquare, 
  Activity,
  LogOut,
  Store
} from 'lucide-react'
import axios from 'axios'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'food', label: 'Manage Food', icon: UtensilsCrossed },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'menu', label: 'Today\'s Menu', icon: Menu },
    { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { id: 'status', label: 'Status', icon: Activity },
  ]


  const nevigate = useNavigate()
  const handelLogout = async()=>{
    try {
      
      await axios.post("http://localhost:3000/api/auth/logout",{},{
        withCredentials:true
      });
      nevigate('/login')
      localStorage.clear()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-orange-600 to-orange-800 text-white shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-orange-500">
        <div className="flex items-center space-x-3">
          <Store className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">GLI Canteen</h1>
            <p className="text-xs text-orange-200">Agra • Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white text-orange-600 shadow-lg scale-105'
                      : 'text-white hover:bg-orange-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <span className="ml-auto w-2 h-2 bg-orange-600 rounded-full"></span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full p-4 border-t border-orange-500">
        <button
         onClick={handelLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-orange-700 transition-all duration-200">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar