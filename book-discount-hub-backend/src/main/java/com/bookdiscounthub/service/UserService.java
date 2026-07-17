package com.bookdiscounthub.service;

import com.bookdiscounthub.dto.RegisterRequest;
import com.bookdiscounthub.entity.PublisherProfile;
import com.bookdiscounthub.entity.Role;
import com.bookdiscounthub.entity.User;
import com.bookdiscounthub.entity.VerificationStatus;
import com.bookdiscounthub.repository.PublisherProfileRepository;
import com.bookdiscounthub.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PublisherProfileRepository publisherProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PublisherProfileRepository publisherProfileRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.publisherProfileRepository = publisherProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * ერთიანი რეგისტრაციის მეთოდი USER-ისთვისაც და PUBLISHER-ისთვისაც.
     * role=PUBLISHER შემთხვევაში დამატებით იქმნება PublisherProfile PENDING სტატუსით.
     * ADMIN ამ მეთოდით არ იქმნება - ადმინი ბაზაში ხელით/seed-ით უნდა დაემატოს.
     */
    @Transactional
    public User register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("ADMIN ანგარიში საჯარო რეგისტრაციით არ იქმნება");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("ეს ელ. ფოსტა უკვე დარეგისტრირებულია: " + request.getEmail());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setEnabled(true); // ბლოკირება ცალკე ADMIN-ის ქმედებაა, არა რეგისტრაციის ნაწილი
        user = userRepository.save(user);

        if (request.getRole() == Role.PUBLISHER) {
            if (request.getBrandName() == null || request.getBrandName().isBlank()) {
                throw new IllegalArgumentException("Publisher-ისთვის brandName სავალდებულოა");
            }
            PublisherProfile profile = new PublisherProfile();
            profile.setUser(user);
            profile.setBrandName(request.getBrandName());
            profile.setDescription(request.getDescription());
            profile.setVerificationStatus(VerificationStatus.PENDING); // ადმინის დამტკიცების მოლოდინში
            publisherProfileRepository.save(profile);
        }

        return user;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("მომხმარებელი ვერ მოიძებნა: " + email));
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("მომხმარებელი ვერ მოიძებნა, id=" + id));
    }
}