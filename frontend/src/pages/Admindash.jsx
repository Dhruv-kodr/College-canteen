// Admindash.jsx
import React from 'react'
import Structure from '../components/Admin/Structure'
import { Toaster } from 'react-hot-toast'
import AdminContextProvider from '../contexts/AdminContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Admindash = () => {

  const navigate=useNavigate()

   useEffect(() => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user")) 

    if (!token || user?.role !== "admin") {
      navigate("/login")
    }

  }, [navigate])

  return (
    <AdminContextProvider>
      <div className='w-full h-screen box-border bg-gray-50'>
        <Toaster position="bottom-right" />
        <Structure/>
        
      </div>
    </AdminContextProvider>
  )
}

export default Admindash