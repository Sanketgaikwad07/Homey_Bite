package com.mywork.homey_bites.servies;

import com.mywork.homey_bites.entity.UserEntity;
import com.mywork.homey_bites.io.UserRequest;
import com.mywork.homey_bites.io.UserResponse;
import com.mywork.homey_bites.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserServices {

private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthentictonFacade authentictonFacade;
    @Override
    public UserResponse registerUser(UserRequest Request) {
      UserEntity newUser= convertToEntity(Request);
      newUser=userRepository.save(newUser);
      return  convertToResponse(newUser);
    }

    @Override
    public String findByUserId() {
        String loggedEmail=authentictonFacade.getauthentication().getName();
       UserEntity loggedUser= userRepository.findByEmail(loggedEmail).orElseThrow(()->new UsernameNotFoundException("User not found"));
    return  loggedUser.getId();
    }



    private UserEntity convertToEntity(UserRequest Request) {
return   UserEntity.builder()
        .email(Request.getEmail())
        .password(passwordEncoder.encode(Request.getPassword()))
        .name(Request.getName())
        .build();

    }
    private UserResponse convertToResponse(UserEntity registerUser) {
       return UserResponse.builder()
                .email(registerUser.getEmail())
                .id(registerUser.getId())
                .name(registerUser.getName())
                .build();

    }
}
