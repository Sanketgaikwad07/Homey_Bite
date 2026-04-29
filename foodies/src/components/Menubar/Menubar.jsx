import React, { useContext } from 'react'
import './Menubar.css'
import { assets } from '../../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';


const Menubar=()=> {
  const { quantities, token, setToken, clearCart } = useContext(StoreContext);
  const totalItemCount = Object.values(quantities || {}).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const navigate=useNavigate();
  const logout=()=>{
      localStorage.removeItem('token');
      clearCart();
      setToken("");
      navigate("/");
  }
  return (

  <nav className="navbar navbar-expand-lg navbar-dark bg-dark menubar">
<div className="container">
    <Link to="/" >
      <img src={assets.logo} alt="" className='mx-4'height={80} width={80}/>
    </Link>

  <button className="navbar-toggler" type="button"data-bs-toggle="collapse"data-bs-target="#navbarSupportedContent"aria-controls="navbarSupportedContent"aria-expanded="false"aria-label="Toggle navigation" >
    <span className="navbar-toggler-icon"></span>
  </button> 
  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <NavLink className={({ isActive }) => isActive ? "nav-link fw-bold active" : "nav-link"} to="/" end>
        Home
        </NavLink>
      </li> 
      <li className="nav-item">
        <NavLink className={({ isActive }) => isActive ? "nav-link fw-bold active" : "nav-link"} to="/explore">
        Explore
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={({ isActive }) => isActive ? "nav-link fw-bold active" : "nav-link"} to="/contact">
        Contact us
        </NavLink>
      </li>
    </ul>

    <div className="d-flex align-items-center gap-4">
     <Link to={`/cart`}>
      <div className="position-relative">
        <img src={assets.cart} alt="" height={28} width={28}   className='position-relative'/>
        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning'>
          {totalItemCount}
        </span>
      </div>
     </Link>
  {
    !token ?
    <>
        <button className="btn btn-outline-primary btn-sm" onClick={()=>navigate('/Login')} >Login</button>
      <button className="btn btn-success btn-sm" onClick={()=>navigate('/sign')}>Sign up</button>
    
    </>:<div className="menubar-right">
          <img src={assets.Profile} alt="" width={52} height={52} className="round-circle " />
          <Link className="nav-link p-0" to="/myorder">My Orders</Link>
          <Link className="nav-link p-0" to="/" onClick={logout}>Logout</Link>
    </div>

  }
    </div>
  </div>
</div>
</nav>

  )
}
export default Menubar;
