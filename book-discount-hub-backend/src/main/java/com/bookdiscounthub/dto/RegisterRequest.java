package com.bookdiscounthub.dto;

import com.bookdiscounthub.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private Role role; // USER ან PUBLISHER (ADMIN რეგისტრაციის ფორმით არ იქმნება)

    // მხოლოდ role=PUBLISHER-ისთვის საჭირო ველები
    private String brandName;
    private String description;
}