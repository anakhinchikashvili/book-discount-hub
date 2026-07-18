package com.bookdiscounthub.controller;

import com.bookdiscounthub.dto.ChangePasswordRequest;
import com.bookdiscounthub.dto.RegisterRequest;
import com.bookdiscounthub.dto.UserResponse;
import com.bookdiscounthub.entity.User;
import com.bookdiscounthub.security.CustomUserDetails;
import com.bookdiscounthub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    // Profile გვერდისთვის - საკუთარი მონაცემები ტოკენიდან
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal CustomUserDetails principal,
                                               @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getId(), request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }
}