package com.mywork.homey_bites.repository;

import com.mywork.homey_bites.entity.FoodEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FoodRepository extends MongoRepository<FoodEntity,String>{



}
