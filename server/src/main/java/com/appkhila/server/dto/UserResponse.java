package com.appkhila.server.dto;

import com.appkhila.server.model.User;
import lombok.Data;

@Data
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String createdAt;

    public static UserResponse from(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setName(u.getName());
        r.setEmail(u.getEmail());
        r.setRole(u.getRole().name());
        r.setCreatedAt(u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
        return r;
    }
}
