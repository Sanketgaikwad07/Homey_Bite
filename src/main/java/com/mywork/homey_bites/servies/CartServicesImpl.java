package com.mywork.homey_bites.servies;

import com.mywork.homey_bites.entity.UserEntity;
import com.mywork.homey_bites.entity.cartEntity;
import com.mywork.homey_bites.io.CartRequest;
import com.mywork.homey_bites.io.CartResponse;
import com.mywork.homey_bites.io.UserResponse;
import com.mywork.homey_bites.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.reflect.ParameterizedType;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor

public class CartServicesImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserServices userServices;

    @Override
    public CartResponse addToCart(CartRequest request) {
        String loggedInUserId = userServices.findByUserId();
        Optional<cartEntity> cartOptional = cartRepository.findByUserId(loggedInUserId);
        cartEntity cart = cartOptional.orElseGet(() -> new cartEntity(loggedInUserId, new HashMap<>()));
        Map<String, Integer> CartItems = cart.getItems();
        CartItems.put(request.getFoodId(), CartItems.getOrDefault(request.getFoodId(), 0) + 1);
        cart.setItems(CartItems);
        cart = cartRepository.save(cart);
return convertToResponse(cart);
    }

    @Override
    public CartResponse getCart() {
        String loggedInUserId = userServices.findByUserId();
        cartEntity entity=cartRepository.findByUserId(loggedInUserId)
                .orElse(new cartEntity(null,loggedInUserId, new HashMap<>()));
return convertToResponse(entity);
    }

    @Override
    public void clearCart() {
        String loggedInUserId = userServices.findByUserId();
cartRepository.deleteByUserId(loggedInUserId);
    }

    @Override
    public CartResponse RemoveFromCart(CartRequest request) {
        String loggedInUserId = userServices.findByUserId();
    cartEntity entity=cartRepository.findByUserId(loggedInUserId)
            .orElseThrow(()->new RuntimeException("Cart is not found"));
    Map<String,Integer> CartItems = entity.getItems();
    if(CartItems.containsKey(request.getFoodId())){
int current=CartItems.get(request.getFoodId());
if(current>0){
    CartItems.put(request.getFoodId(),current-1);

}else{
    CartItems.remove(request.getFoodId());
}
entity=cartRepository.save(entity);
    }
    return convertToResponse(entity);
    }

    private CartResponse convertToResponse(cartEntity cartEntity) {
       return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems()).build();

    }
}
