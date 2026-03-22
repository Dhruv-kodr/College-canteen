// ManageMenu.jsx
import React, { useContext, useState } from 'react'
import { AdminContext } from '../../contexts/AdminContext'
import { 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Save,
  Sun,
  Moon,
  Coffee
} from 'lucide-react'
import toast from 'react-hot-toast'

const ManageMenu = () => {
  const { foods } = useContext(AdminContext)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [menu, setMenu] = useState({
    breakfast: [],
    lunch: [],
    dinner: []
  })

  // Simulated saved menu state
  const [savedMenu, setSavedMenu] = useState(null)

  const handleToggleItem = (mealType, foodId) => {
    setMenu(prev => ({
      ...prev,
      [mealType]: prev[mealType].includes(foodId)
        ? prev[mealType].filter(id => id !== foodId)
        : [...prev[mealType], foodId]
    }))
  }

  const handleSaveMenu = () => {
    setSavedMenu({
      date: selectedDate,
      ...menu
    })
    toast.success('Today\'s menu saved successfully!')
  }

  const getSelectedFoods = (mealType) => {
    return foods.filter(food => menu[mealType].includes(food._id))
  }

  const mealIcons = {
    breakfast: <Coffee className="h-6 w-6" />,
    lunch: <Sun className="h-6 w-6" />,
    dinner: <Moon className="h-6 w-6" />
  }

  const mealColors = {
    breakfast: 'bg-yellow-500',
    lunch: 'bg-orange-500',
    dinner: 'bg-purple-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Today's Menu</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none focus:outline-none"
            />
          </div>
          <button
            onClick={handleSaveMenu}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Save className="h-5 w-5" />
            <span>Save Menu</span>
          </button>
        </div>
      </div>

      {/* Saved Menu Status */}
      {savedMenu && savedMenu.date === selectedDate && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <div>
            <p className="text-green-700 font-medium">Menu saved for {new Date(selectedDate).toLocaleDateString()}</p>
            <p className="text-green-600 text-sm">
              Breakfast: {savedMenu.breakfast.length} items | 
              Lunch: {savedMenu.lunch.length} items | 
              Dinner: {savedMenu.dinner.length} items
            </p>
          </div>
        </div>
      )}

      {/* Meal Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['breakfast', 'lunch', 'dinner'].map((mealType) => (
          <div key={mealType} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Meal Header */}
            <div className={`${mealColors[mealType]} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {mealIcons[mealType]}
                  <h2 className="text-xl font-semibold capitalize">{mealType}</h2>
                </div>
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-sm opacity-90 mt-1">
                {mealType === 'breakfast' && '7:00 AM - 10:00 AM'}
                {mealType === 'lunch' && '12:00 PM - 3:00 PM'}
                {mealType === 'dinner' && '7:00 PM - 10:00 PM'}
              </p>
            </div>

            {/* Selected Items */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">Selected Items ({getSelectedFoods(mealType).length})</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getSelectedFoods(mealType).map(food => (
                  <div key={food._id} className="flex items-center justify-between bg-orange-50 p-2 rounded">
                    <span className="text-sm font-medium text-gray-700">{food.name}</span>
                    <span className="text-sm text-orange-600">₹{food.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Items */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Available Items</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {foods.map(food => (
                  <div
                    key={food._id}
                    onClick={() => handleToggleItem(mealType, food._id)}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      menu[mealType].includes(food._id)
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {menu[mealType].includes(food._id) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className="text-sm text-gray-700">{food.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">₹{food.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Menu Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['breakfast', 'lunch', 'dinner'].map((mealType) => (
            <div key={mealType} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-12 h-12 ${mealColors[mealType]} rounded-full flex items-center justify-center text-white mx-auto mb-3`}>
                {mealIcons[mealType]}
              </div>
              <p className="text-2xl font-bold text-gray-800">{menu[mealType].length}</p>
              <p className="text-sm text-gray-500 capitalize">{mealType} Items</p>
              <p className="text-xs text-gray-400 mt-2">
                Total: ₹{getSelectedFoods(mealType).reduce((sum, food) => sum + food.price, 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageMenu