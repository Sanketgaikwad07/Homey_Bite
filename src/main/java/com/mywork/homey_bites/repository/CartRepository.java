package com.mywork.homey_bites.repository;

import com.mywork.homey_bites.entity.cartEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<cartEntity,String> {


    Optional<cartEntity> findByUserId(String userId);
    void deleteByUserId(String userId);

}



