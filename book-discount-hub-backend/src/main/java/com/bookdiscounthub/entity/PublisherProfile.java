package com.bookdiscounthub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * მხოლოდ role=PUBLISHER მქონე User-ებს გააჩნიათ ეს ჩანაწერი.
 * ცალკე გატანილია User-ისგან, რომ User "სუფთა" auth/identity ცხრილად დარჩეს,
 * ხოლო ბიზნეს-სპეციფიკური (გამომცემლობის) ველები აქ იყოს.
 */
@Entity
@Table(name = "publisher_profiles")
@Getter
@Setter
@NoArgsConstructor
public class PublisherProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String brandName; // გამომცემლობის დასახელება

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
}