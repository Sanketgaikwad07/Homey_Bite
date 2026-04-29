package com.mywork.homey_bites.servies;

import com.mywork.homey_bites.io.OrderRequest;
import com.mywork.homey_bites.io.OrderResponse;
import com.razorpay.RazorpayException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


public interface OrderServices {

    OrderResponse createdOrderWithPayment(OrderRequest request) throws RazorpayException;
    void verfiyPayment(Map<String,String> paymentData, String Status);

    List<OrderResponse> getUserOrders();
    void removeOrder(String orderId);

    List<OrderResponse> getOrdersAllUser();

    void updateOrderStatus(String orderId,String status);
}
