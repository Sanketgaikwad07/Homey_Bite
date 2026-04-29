package com.mywork.homey_bites.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

private List<OrderItems> orderItems;
private String userAddress;
private double amount;
private String phoneNumber;
private String email;
private String orderStatus;
}
