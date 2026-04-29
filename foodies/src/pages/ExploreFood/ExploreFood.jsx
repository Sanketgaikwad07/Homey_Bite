import React from 'react'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useState } from 'react';

export default function ExploreFood() {

const[category,setCategory] = useState('All');
const[searchText,setSearchText] = useState('');
  return (
   <>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={(e) => 
            e.preventDefault()
            // Handle search logic here, e.g., filter food items based on searchText and category
}>
            <div className="input-group mb-3">
              <select className='form-select mt-2' style={{'maxWidth':'150px'}}  onChange={(e) => setCategory(e.target.value)}>
                <option value="All">All</option>
                <option value="Biryani">Briyani</option>
                <option value="Pizza">Pizza</option>
                <option value="Burger">Burger</option>
                <option value="Salad">Salad</option>
                <option value="Dessert">Dessert</option>
                <option value="Drinks">Drinks</option>
                <option value="Ice cream">Ice cream</option>
                <option value="Pasta">Pasta</option>
                
              </select>

              <input type="text" className='form-control mt-2' placeholder='Search for food...' 
              value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              <button className='btn btn-primary mt-2' type='submit'>
                <i className="bi bi-search"></i>
              </button>

            </div>
          </form>

        </div>

      </div>

    </div>
    <FoodDisplay category={category} searchText={searchText} />
   </>
  )
}
