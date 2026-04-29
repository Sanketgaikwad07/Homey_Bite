package com.mywork.homey_bites.controller;

import com.mywork.homey_bites.io.CartRequest;
import com.mywork.homey_bites.io.CartResponse;
import com.mywork.homey_bites.servies.CartService;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {
    private  final CartService cartService;

@PostMapping
    public CartResponse addToCart(@RequestBody CartRequest request){
        String foodID=request.getFoodId();
        if(foodID==null||foodID.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Food ID is empty");


}
return cartService.addToCart(request);
//return ResponseEntity.ok().body(null);

    }
@GetMapping
    public CartResponse getCart(){
    return  cartService.getCart();
}

@DeleteMapping
@ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(){
    cartService.clearCart();
}

@PostMapping("/remove")
    public CartResponse removeFromCart(@RequestBody CartRequest request){
    String foodID=request.getFoodId();
    if(foodID==null||foodID.isEmpty()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Food ID is empty");
    }
    return  cartService.RemoveFromCart(request);
}
}
