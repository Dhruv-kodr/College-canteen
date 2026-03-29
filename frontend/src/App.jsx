import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Admindash from './pages/Admindash'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/CheckOut'
import Success from './pages/Success'
import Orders from './pages/Orders'

const App = () => {
  return (
    <div className='scroll-smooth'>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/admin' element={<Admindash/>} />
        <Route path='/menu' element={<Menu/>} />
        <Route path='/cart/:id' element={<Cart/>}/>
        <Route path='/checkout' element={<Checkout/>} />
        <Route path='/success' element={<Success/>} />
        <Route path='/my-orders' element={<Orders/>} />

      </Routes>
    </div>
  )
}

export default App
