import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import './ListFood.css';
import { getFoodList, deleteFood } from '../../services/foodService';



export default function ListFood() {
const [list, setList] = React.useState([])
 const fetechList = async () => {
  try{
    const data = await getFoodList();
    setList(data);
  }catch (error){
    toast.error("Error fetching food list");
  }

}
const removeFood = async (foodId) => {
  try{
    const success = await deleteFood(foodId);
    if(success){
      toast.success("Food Removed Successfully");
      await fetechList();
    }else{
      toast.error("Failed to delete food");
    }
  }catch (error){
    toast.error("Error deleting food");
  }

}


useEffect(() => {
 fetechList();
},[])
  return (
  <div className="py-5 row justify-content-center">
 <div className="col-md-11">
      </div>
    <table className='table'>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
       {
        list.map((item,index)=>{
          return(
            <tr key={index}>
              <td> 
                <img src={item.imageUrl} alt="" height={48} width={48} />
              </td>
              <td> 
                {item.name}
              </td>
              <td>
                {item.category}
              </td>
              <td>
                &#8377;{item.price}.00
              </td>
              <td className='text-danger'>
                <i className='bi bi-x-circle-fill' onClick={()=> removeFood(item.id)}></i>
              </td> 
            </tr>
          )
        })
       }
      </tbody>
    </table>
    </ div>
  )
}
