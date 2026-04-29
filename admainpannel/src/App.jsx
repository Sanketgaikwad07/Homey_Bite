import React from 'react';
import AddFood from './pages/AddFood/AddFood';
import ListFood from './pages/ListFood/ListFood';
import Order from './pages/Order/Order';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Menubar from './components/Menubar/Menubar';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

const toggleSidebar = () => {
  setSidebarVisible(!sidebarVisible);
}

  return (
    <div className="d-flex" id="wrapper">

      <Sidebar sidebarVisible={sidebarVisible}/>


      <div id="page-content-wrapper">

        <Menubar toggleSidebar={toggleSidebar} />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
        />

        <div className="container-fluid">
          <Routes>
            <Route path="/add" element={<AddFood/>} />
            <Route path="/list" element={<ListFood/>} />
            <Route path="/orders" element={<Order/>} />
            <Route path="/" element={<ListFood/>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
export default App;
