package com.bookdiscounthub.repository;

import com.bookdiscounthub.entity.Book;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // Publisher Dashboard-ისთვის: მხოლოდ კონკრეტული გამომცემლის (PublisherProfile) წიგნები
    List<Book> findByPublisherIdAndActiveTrue(Long publisherProfileId);

    // მთავარი კატალოგი: მხოლოდ აქტიური (არაწაშლილი) წიგნები
    List<Book> findByActiveTrue();

    /**
     * ერთიანი ფილტრი/ძებნა: ყველა პარამეტრი optional-ია (null = "არ არის შეზღუდვა").
     * keyword ეძებს სათაურსა და ავტორში, genreId/minPrice/maxPrice ისევე მუშაობს,
     * როგორც ადრე. ეს ცალკეული searchByKeyword()-ს ანაცვლებს - ერთი endpoint,
     * ერთი query, ყველა კომბინაცია ერთდროულად შესაძლებელია.
     */
    @Query("SELECT b FROM Book b WHERE b.active = true " +
            "AND (:genreId IS NULL OR EXISTS (SELECT 1 FROM b.genres g WHERE g.id = :genreId)) " +
            "AND (:minPrice IS NULL OR (b.price * (1 - b.discountPercentage / 100.0)) >= :minPrice) " +
            "AND (:maxPrice IS NULL OR (b.price * (1 - b.discountPercentage / 100.0)) <= :maxPrice) " +
            "AND (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            "OR LOWER(b.author) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')))")
    List<Book> filterBooks(@Param("genreId") Long genreId,
                           @Param("minPrice") BigDecimal minPrice,
                           @Param("maxPrice") BigDecimal maxPrice,
                           @Param("keyword") String keyword,
                           Sort sort);
}