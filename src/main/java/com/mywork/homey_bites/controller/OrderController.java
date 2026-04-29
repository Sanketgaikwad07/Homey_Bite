package com.mywork.homey_bites.controller;


import com.mywork.homey_bites.io.OrderRequest;
import com.mywork.homey_bites.io.OrderResponse;
import com.mywork.homey_bites.servies.OrderServices;
import com.razorpay.RazorpayException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderServices orderServices;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest request) throws RazorpayException {

        OrderResponse response = orderServices.createdOrderWithPayment(request);
        return response;

    }
    @PostMapping("/verify")
    public void  verfiyPayment(@RequestBody Map<String,String> paymentData)  {
        orderServices.verfiyPayment(paymentData,"Paid");

    }
    @GetMapping
    public List<OrderResponse> getOrders() {
        return orderServices.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletOrder(@PathVariable String orderId) {
            orderServices.removeOrder(orderId);

    }
    //admin pannel
    @GetMapping("/all")
    public List<OrderResponse> getAllOrders() {
        return orderServices.getUserOrders();
    }
    //admian pannel api
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId, @RequestBody String status) {
        orderServices.updateOrderStatus(orderId,status);


    }
}
