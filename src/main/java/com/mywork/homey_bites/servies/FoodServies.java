package com.mywork.homey_bites.servies;

import com.mywork.homey_bites.io.FoodRequest;
import com.mywork.homey_bites.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodServies {
    String uploadFile(MultipartFile file);
FoodResponse addFood(FoodRequest request, MultipartFile file);

List<FoodResponse> readFood();
FoodResponse readFood(String id);

boolean deleteFile(String filename);
void deleteFood(String id);

}
