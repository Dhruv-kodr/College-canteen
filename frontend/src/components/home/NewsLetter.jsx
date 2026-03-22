import React from 'react'

const NewsLetter = () => {
  return (
    <>
    <section className="py-20 px-6 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Subscribe to Our Newsletter
            </span>
          </h2>
          <p className="text-gray-400 mb-8">
            Get the latest updates on new dishes and special offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto px-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:border-green-500 transition-colors"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full font-bold hover:shadow-2xl hover:shadow-green-500/30 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default NewsLetter
