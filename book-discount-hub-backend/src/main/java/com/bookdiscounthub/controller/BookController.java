package com.bookdiscounthub.controller;

import com.bookdiscounthub.dto.BookRequest;
import com.bookdiscounthub.dto.BookResponse;
import com.bookdiscounthub.security.CustomUserDetails;
import com.bookdiscounthub.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // ---------- Publisher Dashboard (ტოკენიდან, არა path/query param-იდან) ----------

    @GetMapping("/my")
    public ResponseEntity<List<BookResponse>> getMyBooks(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(bookService.getBooksByPublisher(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<BookResponse> createBook(@AuthenticationPrincipal CustomUserDetails principal,
                                                   @RequestBody BookRequest request) {
        BookResponse created = bookService.createBook(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long id,
                                                   @AuthenticationPrincipal CustomUserDetails principal,
                                                   @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, principal.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id,
                                           @AuthenticationPrincipal CustomUserDetails principal) {
        bookService.deleteBook(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}