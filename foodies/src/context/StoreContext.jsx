
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { fetchFoodList } from "../Service/foodService";
import axios from "axios";
import { buildAuthHeader } from '../Service/http';
import { addToCart, getCartData, removeItemFromCart, removeQtyFromCart } from "../Service/CartServires";

export const StoreContext=createContext(null);

export const StoreContextProvider=(props)=>{


    const [foodList, setFoodList] = useState([]);
    const initialToken = localStorage.getItem("token") || "";
    const[token , setToken]=useState(initialToken);

    const[quantities,setQuantities]=useState(() => {
        try {
            const saved = localStorage.getItem("cart_quantities");
            // If there's no stored auth token at startup, treat cart as empty
            if (!initialToken) {
                if (saved) {
                    try { localStorage.removeItem("cart_quantities"); } catch {}
                }
                return {};
            }
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

        const increaseQty=async(foodId)=>{
            setQuantities((prev)=>({...prev,[foodId]:(prev[foodId]||0)+1}));

await addToCart(foodId,token);
        }
        const decreaseQty=async(foodId)=>{
            setQuantities((prev)=>({...prev,[foodId]:prev[foodId]>0 ? prev [foodId]-1:0}));

            await removeQtyFromCart(foodId,token);
        };

        const removeFromCart=async(foodId)=>{
            setQuantities((prevQuanlities)=>{
                const updateQualities={...prevQuanlities};
                delete updateQualities[foodId];
                return updateQualities;
            })
            await removeItemFromCart(foodId, token);
        }

        const clearCart = () => {
            setQuantities({});
            try {
                localStorage.removeItem("cart_quantities");
            } catch {
                // Ignore storage errors
            }
        };

        // If server-side clear was pending (e.g. token expired during checkout), try it when token becomes available
        useEffect(() => {
            const tryPendingServerClear = async () => {
                try {
                    const pending = localStorage.getItem('pending_server_cart_clear');
                    if (!pending) return;
                    const t = token || (localStorage.getItem('token') || '').trim();
                    if (!t) return;
                    try {
                        await axios.delete('http://localhost:8080/api/cart', { headers: buildAuthHeader(t) });
                        localStorage.removeItem('pending_server_cart_clear');
                        // also ensure server cart data reflected locally
                        await loadCartData(t);
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.debug('pending server clear failed:', err?.response?.status, err?.response?.data || err?.message);
                    }
                } catch (e) {
                    // ignore unexpected errors
                }
            };
            tryPendingServerClear();
        }, [token]);

const loadCartData=async(token)=>{
        const items = await getCartData(token);
        let normalized = {};
        if (!items) {
            normalized = {};
        } else if (Array.isArray(items)) {
            // server may return an array of cart items [{ foodId, quantity }, ...]
            items.forEach((it) => {
                if (it && (it.foodId || it.foodId === 0)) {
                    normalized[it.foodId] = Number(it.quantity) || 0;
                }
            });
        } else if (typeof items === 'object') {
            // server may return an object mapping { [foodId]: qty }
            normalized = items;
        }

        setQuantities(normalized || {});

}





const contextValue = {
        foodList,
        increaseQty,
       decreaseQty,
        quantities,
        removeFromCart,
        clearCart,
        token,
        setToken
      
    };
    
    useEffect(()=>{
        async function loadData(){
            try{
                const data=await fetchFoodList();
                setFoodList(data);
                const storedToken = localStorage.getItem("token");
                if (storedToken) {
                    setToken(storedToken);
                    await loadCartData(storedToken);
                }
            
            }catch(error){
                console.log('Failed to load food list:', error);
            }
        }
        
        loadData();
    },[])

    // If a payment just cleared, ensure cart is empty (safety-net for race conditions)
    useEffect(() => {
        try {
            const marker = localStorage.getItem('lastPaymentCleared');
            if (marker) {
                setQuantities({});
                localStorage.removeItem('cart_quantities');
                localStorage.removeItem('lastPaymentCleared');
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        try {
            localStorage.setItem("cart_quantities", JSON.stringify(quantities));
        } catch {
            // Ignore storage errors (e.g., private mode or quota exceeded)
        }
    }, [quantities]);

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
