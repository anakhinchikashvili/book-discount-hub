package com.bookdiscounthub.repository;

import com.bookdiscounthub.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // Publisher Dashboard-ისთვის: მხოლოდ კონკრეტული გამომცემლის წიგნები
    List<Book> findByPublisherId(Long publisherId);

    // მარტივი სახელით/ავტორით ძებნისთვის (Navbar-ის საძიებო ველი)
    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author);
}