package com.mywork.homey_bites.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class AuthenticationResponse {
   // private String token;
    private String email;
    private String token;

}
