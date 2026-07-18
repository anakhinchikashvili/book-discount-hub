package com.bookdiscounthub.dto;

import com.bookdiscounthub.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private Long userId;
    private String fullName;
    private Role role;
}