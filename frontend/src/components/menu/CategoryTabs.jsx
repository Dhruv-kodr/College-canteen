import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../contexts/DataContext'
import { Pizza, Salad, Beef, Coffee, Utensils } from 'lucide-react'

const CategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const { foodData } = useContext(DataContext);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    if (foodData && foodData.length > 0) {
      // Get unique categories from food data
      const uniqueCategories = ['all', ...new Set(foodData.map(item => item.category))];
      setCategories(uniqueCategories);
      
      // Calculate counts for each category
      const counts = {};
      uniqueCategories.forEach(cat => {
        if (cat === 'all') {
          counts[cat] = foodData.length;
        } else {
          counts[cat] = foodData.filter(item => item.category === cat).length;
        }
      });
      setCategoryCounts(counts);
    }
  }, [foodData]);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'veg': 
        return <Salad className="w-5 h-5" />;
      case 'nonVeg': 
        return <Beef className="w-5 h-5" />;
      case 'fastfood': 
        return <Pizza className="w-5 h-5" />;
      case 'all':
        return <Utensils className="w-5 h-5" />;
      default: 
        return <Coffee className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'veg': return 'green';
      case 'nonVeg': return 'red';
      case 'fastfood': return 'yellow';
      default: return 'blue';
    }
  };

  const getCategoryName = (category) => {
    switch(category) {
      case 'veg': return 'Vegetarian';
      case 'nonVeg': return 'Non-Veg';
      case 'fastfood': return 'Fast Food';
      case 'all': return 'All Items';
      default: return category;
    }
  };

  return (
    <div className=" bg-gray-950/95 backdrop-blur-md border-y border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center overflow-x-auto py-4 gap-2 scrollbar-hide">
          {categories.map((category) => {
            const color = getCategoryColor(category);
            const isActive = activeCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap
                  transition-all duration-300 relative group
                  ${isActive 
                    ? color === 'green' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105' :
                      color === 'red' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105' :
                      color === 'yellow' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30 scale-105' :
                      'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
                  }
                `}
              >
                {getCategoryIcon(category)}
                <span>{getCategoryName(category)}</span>
                <span className={`
                  ml-2 px-2 py-0.5 rounded-full text-xs font-bold
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                  }
                `}>
                  {categoryCounts[category] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoryTabs