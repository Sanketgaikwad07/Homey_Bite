package com.mywork.homey_bites.io;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderResponse {
    private String id;
    private String userId;
    private String userAddress;
    private String userEmail;
    private String userPhone;

    private double amount;
    private String PaymentStatus;

    private String razorpayOrderId;

    private String orderStatus;
private List<OrderItems> orderItems;
}
