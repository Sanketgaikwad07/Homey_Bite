package com.mywork.homey_bites.controller;

import com.mywork.homey_bites.io.FoodRequest;
import com.mywork.homey_bites.io.FoodResponse;
import com.mywork.homey_bites.repository.FoodRepository;
import com.mywork.homey_bites.servies.FoodServies;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.thirdparty.jackson.core.JsonProcessingException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
@CrossOrigin("*")
public class FoodController {

    private FoodServies foodServies;

    @PostMapping("")
    public FoodResponse addFood(@RequestPart("food") String foodString,
                                @RequestPart("file") MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper();
        FoodRequest request=null;


        try {
            request = objectMapper.readValue(foodString, FoodRequest.class);

        }catch (Exception e){
throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid JSON format");
        }
        FoodResponse response= foodServies.addFood(request,file);
return response;
    }
@GetMapping
public List<FoodResponse> readFoods(){
        return foodServies.readFood();


}
@GetMapping("/{id}")
public FoodResponse readFood(@PathVariable String id){
        return foodServies.readFood(id);


}

@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void deleteFood(@PathVariable String id){
foodServies.deleteFood(id);
}
}
