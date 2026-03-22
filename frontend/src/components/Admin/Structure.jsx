// Structure.jsx
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import ManageFood from './ManageFood'
import ManageUsers from './ManageUsers'
import ManageMenu from './ManageMenu'
import Feedbacks from './Feedbacks'
import Status from './Status'

const Structure = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderComponent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'food':
        return <ManageFood />
      case 'users':
        return <ManageUsers />
      case 'menu':
        return <ManageMenu />
      case 'feedbacks':
        return <Feedbacks />
      case 'status':
        return <Status />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area with Scroll */}
      <div className="flex-1 overflow-y-auto ml-64">
        <div className="p-8">
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}

export default Structure