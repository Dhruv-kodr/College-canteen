import React from 'react'
import image from '../../assets/download.jpeg'
const Food = () => {
  return (
    <div className='w-70 flex flex-col justify-between pb-4 h-100 border-2 rounded-2xl shrink-0 p-2'>
                <img src={image} alt="" className='w-full h-1/2  object-cover rounded-2xl bg-red-500' />
                
                <div className='border-1 p-2 my-4'>
                  <h3>name: </h3>
                  <h4>description: Lorem ipsum </h4>
                  <h4>price: </h4>
                </div>
                <div className='flex justify-between px-3 '>
                  <h2 className='bg-green-700 px-2 py-1 font-bold text-sm rounded-lg'>buy now</h2>
                  <h2 className='bg-blue-600 px-2 py-1 font-bold text-sm rounded-lg'>add to cart</h2>
                </div>
                </div>
              
  )
}

export default Food
