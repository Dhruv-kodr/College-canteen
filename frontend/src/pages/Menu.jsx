import React, { useState } from 'react'
import Navbar from '../components/home/Navbar'
import Footer from '../components/Footer'
import MenuHero from '../components/menu/MenuHero'
import CategoryTabs from '../components/menu/CategoryTabs'
import FoodGrid from '../components/menu/FoodGrid'
import SpecialOffers from '../components/menu/SpecialOffers '  // Fixed: Removed extra space
import { Toaster } from 'react-hot-toast'

const Menu = () => {
  // Define the state variables
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div>
      <Toaster position="bottom-right" />
      <div className='bg-amber-700'>
      <Navbar/>
      </div>
      <MenuHero/>
      <CategoryTabs 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      <FoodGrid activeCategory={activeCategory} />
      <SpecialOffers/>
      <Footer/>
    </div>
  )
}

export default Menu