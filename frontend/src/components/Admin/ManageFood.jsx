// ManageFood.jsx
import React, { useContext, useState } from 'react'
import { AdminContext } from '../../contexts/AdminContext'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Upload,
  X,
  Loader
} from 'lucide-react'
import toast from 'react-hot-toast'

const ManageFood = () => {
  const { foods, addFood, updateFood, deleteFood } = useContext(AdminContext)
  const [showModal, setShowModal] = useState(false)
  const [editingFood, setEditingFood] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: null,
    video: null
  })

  const categories = ['veg','nonVeg','fastfood']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
  const { name, files } = e.target;

  if (files[0]) {
    const file = files[0];

    // 10MB limit
    if (file.size > 18 * 1024 * 1024) {
      toast.error("File too large (Max 18MB)");
      return;
    }

    setFormData(prev => ({ ...prev, [name]: file }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('price', formData.price)
      data.append('category', formData.category)
      data.append('description', formData.description)
      
      if (formData.image) {
        data.append('image', formData.image)
      }
      if (formData.video) {
        data.append('video', formData.video)
      }

      if (editingFood) {
        await updateFood(editingFood._id, data)
        toast.success('Food updated successfully!')
      } else {
        await addFood(data)
        toast.success('Food added successfully!')
      }

      setShowModal(false)
      resetForm()
    } catch (error) {
      toast.error(editingFood ? 'Failed to update food' : 'Failed to add food',error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (food) => {
    setEditingFood(food)
    setFormData({
      name: food.name,
      price: food.price,
      category: food.category,
      description: food.description,
      image: null,
      video: null
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await deleteFood(id)
        toast.success('Food deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete food',error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      image: null,
      video: null
    })
    setEditingFood(null)
  }

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Food Items</h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Food</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search foods by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food) => (
          <div key={food._id} className="bg-white rounded-xl shadow-lg overflow-hidden group">
            <div className="relative h-48">
              <img 
                src={food.image ? `http://localhost:3000/${food.image}` : 'https://via.placeholder.com/400x200'} 
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                <button
                  onClick={() => handleEdit(food)}
                  className="p-2 bg-white rounded-full hover:bg-orange-600 hover:text-white transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(food._id)}
                  className="p-2 bg-white rounded-full hover:bg-red-600 hover:text-white transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{food.name}</h3>
                <span className="text-lg font-bold text-orange-600">₹{food.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{food.description}</p>
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                  {food.category}
                </span>
                {food.video && (
                  <span className="text-xs text-gray-500">Has video</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500">
                        {formData.image ? formData.image.name : 'Click to upload image'}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Video (optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      name="video"
                      onChange={handleFileChange}
                      accept="video/*"
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500">
                        {formData.video ? formData.video.name : 'Click to upload video'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading && <Loader className="h-5 w-5 animate-spin" />}
                  <span>{loading ? 'Saving...' : (editingFood ? 'Update Food' : 'Add Food')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageFood