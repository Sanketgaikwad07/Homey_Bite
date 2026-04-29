package com.mywork.homey_bites.entity;

import com.mywork.homey_bites.io.OrderItems;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection="orders")
@Data
@Builder

public class OrderEntity {
    @Id
    private String id;
    private  String userId;
    private String userAddress;
    private String userEmail;
    private String userPhone;
    private List<OrderItems> orderItems;
    private double amount;
    private String PaymentStatus;
   // private String razorpayOderId;
    private String razorpayOrderId;
    private String razorpaySignature;
    private String orderStatus;
    private String razorpayPaymentId;



}
