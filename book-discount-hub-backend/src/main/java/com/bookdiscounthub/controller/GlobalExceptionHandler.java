package com.bookdiscounthub.controller;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * ერთი ცენტრალური exception handling ყველა Controller-სთვის.
 * UserController-ში ადრე ლოკალურად გვქონდა @ExceptionHandler - ეს აქ გადმოვიდა,
 * რომ ყოველ ახალ Controller-ში აღარ დაგვჭირდეს გამეორება.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ვალიდაცია/ბიზნეს წესის დარღვევა (მაგ. "არასაკმარისი მარაგი", "ეს წიგნი არ გეკუთვნით")
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    // მოთხოვნილი რესურსი ვერ მოიძებნა
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}