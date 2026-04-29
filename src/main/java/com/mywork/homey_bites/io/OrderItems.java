package com.mywork.homey_bites.io;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItems {
    private String foodID;
    private int quantity;
    private double price;
    private String category;
  private String imgUrl;
  private String description;
  private String name;
}
