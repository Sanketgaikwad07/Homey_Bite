import React from 'react'
import { assets } from '../../assets/assets'
import { useState } from 'react';
import { addFood } from '../../services/foodService';
import { toast } from 'react-toastify';

export default function AddFood() {
  const[image , setImage] = useState(null);
  const[data , setData] = useState({
    name : '',
    description : '',
    category : 'Biryani',
    price : ''
  });
  const onChangeHandler = (event) => {
  const name=event.target.name;
  const value=event.target.value;
setData(data => ({...data , [name] : value}));
  };

const onSubmitHandler = async (event) => {
  event.preventDefault();
  if(! image){
    alert('Please select an image');
    return;
  }
try{
  await addFood(data, image);
toast.success('Food added successfully');
setData({
  name : '',description : '',category : 'Biryani',price : ''});
setImage(null);
}catch(error){
const serverMessage = error?.response?.data?.message;
toast.error(serverMessage || 'Error adding food');

  }
  }
  return (

<div className="mx-2 mt-2">
  <div className="row ">
    <div className=" card col-md-4">
      <div className="card-body">
        <h4 className="mb-3">Add Food</h4>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
               <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" width={84}  />
               </label>
            <input type="file" className="form-control form-control-sm" id="image"  hidden onChange={(e) => setImage(e.target.files[0])}/>
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label"> Name</label>
            <input type="text"    placeholder='Enter food name'   className="form-control form-control-sm"  id="name" required name='name' onChange={onChangeHandler} value={data.name}/>
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control form-control-sm"  placeholder='Enter description here...'  id="description" rows="4" required name='description' onChange={onChangeHandler} value={data.description}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select name="category" className="form-control form-control-sm" id="category" onChange={onChangeHandler} value={data.category}>

         <option value="Biryani">Biryani</option>
        <option value="Pizza">Pizza</option>
        <option value="Burger">Burger</option>
        <option value="Noodles">Noodles</option>
       <option value="Pasta">Pasta</option> 
        <option value="Salad">Salad</option>
       <option value="Dessert">Dessert</option>
       <option value="Drinks">Drinks</option>
      <option value="Ice cream">Ice cream</option>
  </select>            
          </div>
            <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="number" className="form-control form-control-sm" id="price"  placeholder='&#8377;200'required name='price' onChange={onChangeHandler} value={data.price}/>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Save</button>
        </form>
      </div>
    </div>
  </div>
</div>
  )
}
