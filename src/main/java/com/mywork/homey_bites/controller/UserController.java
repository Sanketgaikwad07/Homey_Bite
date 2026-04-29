package com.mywork.homey_bites.controller;

import com.mywork.homey_bites.io.UserRequest;
import com.mywork.homey_bites.io.UserResponse;
import com.mywork.homey_bites.servies.UserServices;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController
{


    private final UserServices userServices;


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest Request) {
return userServices.registerUser(Request);



    }
}
