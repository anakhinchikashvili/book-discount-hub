package com.bookdiscounthub.repository;

import com.bookdiscounthub.entity.PublisherProfile;
import com.bookdiscounthub.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PublisherProfileRepository extends JpaRepository<PublisherProfile, Long> {

    Optional<PublisherProfile> findByUserId(Long userId);

    // ADMIN Dashboard-ისთვის: დამტკიცების მოლოდინში მყოფი გამომცემლები
    List<PublisherProfile> findByVerificationStatus(VerificationStatus verificationStatus);
}