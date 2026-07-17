package com.bookdiscounthub.controller;

import com.bookdiscounthub.dto.RegisterRequest;
import com.bookdiscounthub.dto.UserResponse;
import com.bookdiscounthub.entity.User;
import com.bookdiscounthub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        User createdUser = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.fromEntity(createdUser));
    }
}