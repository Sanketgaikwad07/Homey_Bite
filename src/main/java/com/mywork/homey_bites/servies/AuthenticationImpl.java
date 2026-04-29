package com.mywork.homey_bites.servies;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationImpl implements AuthentictonFacade {




    @Override
    public Authentication getauthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
