// components/menu/FoodGrid.jsx
import React, { useContext, useMemo } from "react";
import { DataContext } from "../../contexts/DataContext";
import FoodCard from "../home/FoodCard";

const FoodGrid = ({ activeCategory }) => {
  const { foodData } = useContext(DataContext);

  const filteredFoods = useMemo(() => {
    if (!foodData) return [];
    if (activeCategory === "all") return foodData;
    return foodData.filter((food) => food.category === activeCategory);
  }, [foodData, activeCategory]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "veg":
        return "green";
      case "fastfood":
        return "yellow";
      case "nonVeg":
        return "red";
      default:
        return "green";
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case "veg":
        return "🌱 Veg";
      case "fastfood":
        return "⚡ Fast Food";
      case "nonVeg":
        return "🍗 Non-Veg";
      default:
        return category;
    }
  };

  if (!filteredFoods.length) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-gray-400 text-xl">No items found in this category</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 ">
        {filteredFoods.map((food) => (
          <FoodCard
            key={food._id}
            food={food}
            categoryColor={getCategoryColor(food.category)}
            categoryName={getCategoryTitle(food.category)}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodGrid;