package com.mywork.homey_bites.servies;

import com.mywork.homey_bites.io.CartRequest;
import com.mywork.homey_bites.io.CartResponse;
import org.springframework.stereotype.Service;

@Service
public interface CartService {

CartResponse addToCart(CartRequest request);

CartResponse getCart();

void clearCart();
CartResponse RemoveFromCart(CartRequest request);
}
