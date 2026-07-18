package com.bookdiscounthub.controller;

import com.bookdiscounthub.dto.LoginRequest;
import com.bookdiscounthub.dto.LoginResponse;
import com.bookdiscounthub.entity.User;
import com.bookdiscounthub.security.JwtService;
import com.bookdiscounthub.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        User user;
        try {
            user = userService.getByEmail(request.getEmail());
        } catch (EntityNotFoundException e) {
            // შეგნებულად ერთი და იგივე მესიჯი, არასწორი email-ისთვისაც და პაროლისთვისაც -
            // რომ თავდამსხმელმა ვერ გაარკვიოს, კონკრეტული email საერთოდ არსებობს თუ არა
            throw new IllegalArgumentException("არასწორი ელ. ფოსტა ან პაროლი");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("არასწორი ელ. ფოსტა ან პაროლი");
        }

        if (!user.isEnabled()) {
            throw new IllegalArgumentException("ანგარიში დაბლოკილია, დაუკავშირდით ადმინისტრაციას");
        }

        String token = jwtService.generateToken(user);

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());

        return ResponseEntity.ok(response);
    }
}