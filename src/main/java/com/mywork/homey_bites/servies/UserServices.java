package com.mywork.homey_bites.servies;

import com.mywork.homey_bites.io.UserRequest;
import com.mywork.homey_bites.io.UserResponse;

public interface UserServices {
    UserResponse registerUser(UserRequest userRequest);
    String findByUserId();

}
