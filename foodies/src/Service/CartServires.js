import axios from "axios";
import { buildAuthHeader } from "./http";

const APi_URl='http://localhost:8080/api/cart';

export const addToCart=async(foodId,token)=>{
    try{
          await axios.post(APi_URl,{foodId},{headers:buildAuthHeader(token)});


    }catch(error){
        console.error('Error while adding the cart data',error);

    }

}
export const removeQtyFromCart=async(foodId,token)=>{
    try{
           await axios.post(`${APi_URl}/remove`,{foodId},{headers:buildAuthHeader(token)});

        
    }catch(error){
                console.error('Error while removing Qty from  cart',error);


    }

}

export const removeItemFromCart = async (foodId, token) => {
    try {
        await axios.delete(`${APi_URl}/${foodId}`, { headers: buildAuthHeader(token) });
    } catch (error) {
        console.error('Error while removing item from cart', error);
    }
}
export const getCartData=async(token)=>{
    try{
const response=await axios.get(APi_URl,{headers:buildAuthHeader(token)})

        return response.data.items;
    }catch(error){

        console.error('Error while fetching the cart',error);
        return {};

    }

}
