package com.bookdiscounthub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * ერთი ცხრილი ორივე როლისთვის (User და Publisher).
 * განსხვავებას role ველი განსაზღვრავს.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 60)
    @JsonIgnore
    private String password; // BCrypt ჰეში ყოველთვის 60 სიმბოლოა - AuthService-ში დაჰეშავდება

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /**
     * ზოგადი ჩართვა/გამორთვა ყველა როლისთვის (Spring Security-ს UserDetails.isEnabled()
     * პირდაპირ ამ ველს იყენებს). ADMIN-ის მიერ ბლოკირებისას -> false.
     * Publisher-ის ვერიფიკაცია ცალკეა, იხ. PublisherProfile.verificationStatus.
     */
    @Column(nullable = false)
    private boolean enabled = true;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}