package com.mywork.homey_bites.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="users")
@Builder
public class UserEntity {

    @Id
    private String name;
    private String password;
    private String email;
    private String id;
}
