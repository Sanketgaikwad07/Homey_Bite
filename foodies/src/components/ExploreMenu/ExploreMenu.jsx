import React from 'react'
import { categories } from '../../assets/assets'
import './ExploreMenu.css'
import { use } from 'react'
import { useRef } from 'react'
import { useState } from 'react'


const ExploerMenu = ({category, setCategory}) => {

      const menuRfc=useRef(null);
      const scrollleft=()=>{
       if(menuRfc.current){
        menuRfc.current.scrollBy({left:-200,behavior:'smooth'})
      }
    }
    const scrollRight=()=>{
      if(menuRfc.current){
        menuRfc.current.scrollBy({left:200,behavior:'smooth'})
      }
    }



  return (
   <div  className="explore-menu position-relative">
    <h1 className="d-flex align-items-center  justify-content-between">
    Explore Our Menu
     <div className="d-flex">
        <i className='bi bi-arrow-left-circle scroll-icon' onClick={scrollleft}></i>
          <i className='bi bi-arrow-right-circle scroll-icon' onClick={scrollRight}></i>
    </div>
      </h1>
<p>Explore curated list of delicious dishes from our menu</p> 
   <div className="d-flex justify-content-center gap-4  overflow-auto explore-menu-list " ref={menuRfc}>

    {
        categories.map((item,index) => {
            return (
              <div key={index} className="text-center explore-menu-list-item" onClick={()=>setCategory(prev=>prev===item.category ? 'All': item.category)}>
                <img src={item.icon} alt="" className={item.category===category ? 'rounded-circle active': 'rounded-circle' } height={120} width={120} />
                <p className="mt-2 fw-bold">{item.category}</p>
              </div>
            )

    })
  }
   </div>
   <h1 />
</div>
  )
}
export default ExploerMenu;
