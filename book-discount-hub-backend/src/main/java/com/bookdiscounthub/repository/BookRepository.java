package com.bookdiscounthub.repository;

import com.bookdiscounthub.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // Publisher Dashboard-ისთვის: მხოლოდ კონკრეტული გამომცემლის (PublisherProfile) წიგნები
    List<Book> findByPublisherIdAndActiveTrue(Long publisherProfileId);

    // მთავარი კატალოგი: მხოლოდ აქტიური (არაწაშლილი) წიგნები
    List<Book> findByActiveTrue();

    // მარტივი სახელით/ავტორით ძებნისთვის (Navbar-ის საძიებო ველი), მხოლოდ აქტიურებში
    @Query("SELECT b FROM Book b WHERE b.active = true AND " +
            "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Book> searchByKeyword(@Param("keyword") String keyword);

    // ჟანრით ფილტრაცია
    List<Book> findByGenres_IdAndActiveTrue(Long genreId);
}