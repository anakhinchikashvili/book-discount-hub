package com.bookdiscounthub.controller;

import com.bookdiscounthub.dto.BookRequest;
import com.bookdiscounthub.dto.BookResponse;
import com.bookdiscounthub.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ⚠️ დროებითი შენიშვნა: publisherUserId ჯერ query param-ით მოდის კლიენტიდან,
 * რადგან JWT/Security ჯერ არ გვაქვს დანერგილი (მე-5 ეტაპი).
 * ეს დროებითი და არასაიმედო გადაწყვეტაა - ნებისმიერს შეუძლია ნებისმიერი publisherUserId
 * გამოაგზავნოს და სხვისი publisher-ის სახელით იმოქმედოს.
 * JWT-ის დანერგვის შემდეგ ეს პარამეტრი მოიხსნება და publisherUserId ავტორიზებული
 * მომხმარებლის ტოკენიდან ამოვიღებთ (SecurityContext/Principal), არა request-იდან.
 */
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // ---------- საჯარო კატალოგი ----------

    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllActiveBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookResponse>> searchBooks(@RequestParam String keyword) {
        return ResponseEntity.ok(bookService.searchBooks(keyword));
    }

    @GetMapping("/genre/{genreId}")
    public ResponseEntity<List<BookResponse>> getBooksByGenre(@PathVariable Long genreId) {
        return ResponseEntity.ok(bookService.getBooksByGenre(genreId));
    }

    // ---------- Publisher Dashboard ----------

    @GetMapping("/publisher/{publisherUserId}")
    public ResponseEntity<List<BookResponse>> getMyBooks(@PathVariable Long publisherUserId) {
        return ResponseEntity.ok(bookService.getBooksByPublisher(publisherUserId));
    }

    @PostMapping
    public ResponseEntity<BookResponse> createBook(@RequestParam Long publisherUserId,
                                                   @RequestBody BookRequest request) {
        BookResponse created = bookService.createBook(publisherUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long id,
                                                   @RequestParam Long publisherUserId,
                                                   @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, publisherUserId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id,
                                           @RequestParam Long publisherUserId) {
        bookService.deleteBook(id, publisherUserId);
        return ResponseEntity.noContent().build();
    }
}