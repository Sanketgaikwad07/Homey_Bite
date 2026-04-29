import React from 'react'
import Menubar from './components/Menubar/Menubar'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import ContactUs from './pages/Contact us/Contact';
import ExploreFood from './pages/ExploreFood/ExploreFood';
import FoodDetails from './pages/FoodDetails/FoodDetails';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/Register';
  import { ToastContainer } from 'react-toastify';
  import Myorder from './pages/Myorder/Myorder';
  import { useContext } from 'react';
  import { StoreContext } from './context/StoreContext';


const App=()=> {
  const {token}= useContext(StoreContext);
  return (
    <div>
      <Menubar />
      <ToastContainer/>
   
    <Routes>  
    <Route path='/' element={<Home />} />
    <Route path='/contact' element={<ContactUs />} />
    <Route path='/explore' element={<ExploreFood />} />
     <Route path='/food/:id' element={<FoodDetails />} /> 
     <Route path='/cart'  element={<Cart/>}/> 
 <Route path='/order'  element={token ?<PlaceOrder/> : <Login/>} />
 <Route path='/login' element={token ? <Home /> : <Login />} />
  <Route path='/sign' element={token ? <Home /> : <SignUp />} />
  <Route path="/myorder" element={token ? <Myorder /> : <Login />} />
    </Routes>
    </div>
  )
}
export default App;
       
