// Feedbacks.jsx
import React, { useState } from 'react'
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Filter,
  Search,
  ChevronDown,
  User,
  Calendar,
  Award
} from 'lucide-react'

const Feedbacks = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Sample feedback data (replace with actual data from API)
  const feedbacks = [
    {
      id: 1,
      user: 'Rahul Sharma',
      avatar: 'RS',
      rating: 5,
      comment: 'Amazing food! The paneer butter masala was delicious. Best canteen in Agra!',
      date: '2024-01-15',
      likes: 24,
      foodItem: 'Paneer Butter Masala',
      status: 'published'
    },
    {
      id: 2,
      user: 'Priya Singh',
      avatar: 'PS',
      rating: 4,
      comment: 'Good variety and reasonable prices. The service could be faster though.',
      date: '2024-01-14',
      likes: 15,
      foodItem: 'Veg Biryani',
      status: 'published'
    },
    {
      id: 3,
      user: 'Amit Kumar',
      avatar: 'AK',
      rating: 5,
      comment: 'North Indian thali is must try! Great quality and quantity.',
      date: '2024-01-14',
      likes: 31,
      foodItem: 'North Indian Thali',
      status: 'featured'
    },
    {
      id: 4,
      user: 'Neha Gupta',
      avatar: 'NG',
      rating: 3,
      comment: 'Food is good but need more variety in desserts.',
      date: '2024-01-13',
      likes: 8,
      foodItem: 'Gulab Jamun',
      status: 'pending'
    }
  ]

  const getRatingStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.foodItem.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(feedback => filter === 'all' || feedback.status === filter)

  const stats = [
    { label: 'Total Reviews', value: '847', icon: MessageCircle, color: 'bg-blue-500' },
    { label: 'Average Rating', value: '4.5', icon: Star, color: 'bg-yellow-500' },
    { label: 'Total Likes', value: '2.3k', icon: ThumbsUp, color: 'bg-green-500' },
    { label: 'Featured', value: '12', icon: Award, color: 'bg-purple-500' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Customer Feedbacks</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Feedbacks</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search feedbacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {feedback.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-800">{feedback.user}</h3>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(feedback.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {getRatingStars(feedback.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{feedback.rating}.0</span>
                  </div>
                  <p className="text-gray-700 mb-3">{feedback.comment}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                      {feedback.foodItem}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{feedback.likes}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      feedback.status === 'published' ? 'bg-green-100 text-green-600' :
                      feedback.status === 'featured' ? 'bg-purple-100 text-purple-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center space-x-2">
          <span>Load More Feedbacks</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Feedbacks