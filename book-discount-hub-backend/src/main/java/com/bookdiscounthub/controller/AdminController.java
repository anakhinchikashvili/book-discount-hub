package com.bookdiscounthub.controller;

import com.bookdiscounthub.dto.UserResponse;
import com.bookdiscounthub.entity.Genre;
import com.bookdiscounthub.entity.PublisherProfile;
import com.bookdiscounthub.entity.User;
import com.bookdiscounthub.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * ⚠️ დროებით ყველა endpoint ღიაა (SecurityConfig.permitAll), ანუ ნებისმიერს შეუძლია
 * ADMIN-ის ოპერაციები გამოიძახოს. მე-5 ეტაპზე /api/admin/** მხოლოდ ADMIN როლისთვის დაიხურება.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ---------- 1. Publisher Approval ----------

    @GetMapping("/publishers/pending")
    public ResponseEntity<List<PublisherProfile>> getPendingPublishers() {
        return ResponseEntity.ok(adminService.getPendingPublishers());
    }

    @PutMapping("/publishers/{publisherProfileId}/approve")
    public ResponseEntity<PublisherProfile> approvePublisher(@PathVariable Long publisherProfileId) {
        return ResponseEntity.ok(adminService.approvePublisher(publisherProfileId));
    }

    @PutMapping("/publishers/{publisherProfileId}/reject")
    public ResponseEntity<PublisherProfile> rejectPublisher(@PathVariable Long publisherProfileId) {
        return ResponseEntity.ok(adminService.rejectPublisher(publisherProfileId));
    }

    // ---------- 2. User/Publisher ბლოკირება-აქტივაცია ----------

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/block")
    public ResponseEntity<UserResponse> blockUser(@PathVariable Long userId) {
        User blocked = adminService.blockUser(userId);
        return ResponseEntity.ok(UserResponse.fromEntity(blocked));
    }

    @PutMapping("/users/{userId}/activate")
    public ResponseEntity<UserResponse> activateUser(@PathVariable Long userId) {
        User activated = adminService.activateUser(userId);
        return ResponseEntity.ok(UserResponse.fromEntity(activated));
    }

    // ---------- 3. ჟანრების მართვა ----------

    @GetMapping("/genres")
    public ResponseEntity<List<Genre>> getAllGenres() {
        return ResponseEntity.ok(adminService.getAllGenres());
    }

    @PostMapping("/genres")
    public ResponseEntity<Genre> addGenre(@RequestBody Map<String, String> body) {
        Genre genre = adminService.addGenre(body.get("name"));
        return ResponseEntity.status(HttpStatus.CREATED).body(genre);
    }
}