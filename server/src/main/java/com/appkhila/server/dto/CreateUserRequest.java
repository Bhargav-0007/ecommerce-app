package com.appkhila.server.dto;

import com.appkhila.server.model.Role;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
