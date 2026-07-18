package com.bookdiscounthub.controller;

import com.bookdiscounthub.entity.Genre;
import com.bookdiscounthub.repository.GenreRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * ჟანრების სია საჯაროდ ხელმისაწვდომია (კატალოგის ფილტრი, Publisher-ის წიგნის ფორმა).
 * ჟანრის დამატება კვლავ მხოლოდ ADMIN-ს შეუძლია (/api/admin/genres POST).
 */
@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreRepository genreRepository;

    public GenreController(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @GetMapping
    public ResponseEntity<List<Genre>> getAllGenres() {
        return ResponseEntity.ok(genreRepository.findAll());
    }
}