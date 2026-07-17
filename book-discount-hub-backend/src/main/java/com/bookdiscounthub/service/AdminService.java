package com.bookdiscounthub.service;

import com.bookdiscounthub.entity.Genre;
import com.bookdiscounthub.entity.PublisherProfile;
import com.bookdiscounthub.entity.User;
import com.bookdiscounthub.entity.VerificationStatus;
import com.bookdiscounthub.repository.GenreRepository;
import com.bookdiscounthub.repository.PublisherProfileRepository;
import com.bookdiscounthub.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PublisherProfileRepository publisherProfileRepository;
    private final GenreRepository genreRepository;

    public AdminService(UserRepository userRepository,
                        PublisherProfileRepository publisherProfileRepository,
                        GenreRepository genreRepository) {
        this.userRepository = userRepository;
        this.publisherProfileRepository = publisherProfileRepository;
        this.genreRepository = genreRepository;
    }

    // ---------- 1. Publisher Approval (PublisherProfile.verificationStatus) ----------

    public List<PublisherProfile> getPendingPublishers() {
        return publisherProfileRepository.findByVerificationStatus(VerificationStatus.PENDING);
    }

    public PublisherProfile approvePublisher(Long publisherProfileId) {
        PublisherProfile profile = getProfileOrThrow(publisherProfileId);
        profile.setVerificationStatus(VerificationStatus.APPROVED);
        return publisherProfileRepository.save(profile);
    }

    public PublisherProfile rejectPublisher(Long publisherProfileId) {
        PublisherProfile profile = getProfileOrThrow(publisherProfileId);
        profile.setVerificationStatus(VerificationStatus.REJECTED);
        return publisherProfileRepository.save(profile);
    }

    private PublisherProfile getProfileOrThrow(Long publisherProfileId) {
        return publisherProfileRepository.findById(publisherProfileId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Publisher პროფილი ვერ მოიძებნა, id=" + publisherProfileId));
    }

    // ---------- 2. User/Publisher ბლოკირება-აქტივაცია (User.enabled) ----------

    public User blockUser(Long userId) {
        User user = getUserOrThrow(userId);
        user.setEnabled(false);
        return userRepository.save(user);
    }

    public User activateUser(Long userId) {
        User user = getUserOrThrow(userId);
        user.setEnabled(true);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("მომხმარებელი ვერ მოიძებნა, id=" + userId));
    }

    // ---------- 3. ჟანრების მართვა ----------

    public Genre addGenre(String name) {
        if (genreRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("ეს ჟანრი უკვე არსებობს: " + name);
        }
        Genre genre = new Genre();
        genre.setName(name);
        return genreRepository.save(genre);
    }

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }
}