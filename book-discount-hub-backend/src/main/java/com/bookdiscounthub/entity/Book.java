package com.bookdiscounthub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price; // საწყისი ფასი

    @Column(nullable = false)
    private Integer discountPercentage = 0; // 0-100

    @Column(nullable = false)
    private Integer quantity = 0; // მარაგში არსებული რაოდენობა

    private String coverImageUrl;

    // წიგნის მფლობელი გამომცემელი (User-ის ჩანაწერი role=PUBLISHER)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id", nullable = false)
    private User publisher;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * გამოთვლადი ველი: ფასდაკლებიანი საბოლოო ფასი.
     * ბაზაში არ ინახება, მხოლოდ runtime-ზე გამოითვლება.
     */
    @Transient
    public BigDecimal getFinalPrice() {
        BigDecimal discountMultiplier = BigDecimal.ONE.subtract(
                BigDecimal.valueOf(discountPercentage).divide(BigDecimal.valueOf(100))
        );
        return price.multiply(discountMultiplier);
    }
}