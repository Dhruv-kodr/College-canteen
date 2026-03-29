import React, { useEffect } from 'react'
import Navbar from '../components/home/Navbar'
import MainPart from '../components/home/MainPart'
import { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';



const Home = () => {
  
  const navigate = useNavigate();

useEffect(() => {
      const token = localStorage.getItem("token")
  
      if (!token ) {
        navigate("/login")
      }
  
    }, [navigate])
  return (
    <div className='min-h-screen text-black relative z-50' >
      <Toaster position="bottom-right" />

      <MainPart/>
    </div>
  )
}

export default Home
