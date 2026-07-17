package com.bookdiscounthub.dto;

import com.bookdiscounthub.entity.Book;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private String description;
    private BigDecimal price;
    private Integer discountPercentage;
    private BigDecimal finalPrice;
    private Integer quantity;
    private String coverImageUrl;
    private String publisherBrandName;
    private Set<String> genres;

    public static BookResponse fromEntity(Book book) {
        BookResponse dto = new BookResponse();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setDescription(book.getDescription());
        dto.setPrice(book.getPrice());
        dto.setDiscountPercentage(book.getDiscountPercentage());
        dto.setFinalPrice(book.getFinalPrice());
        dto.setQuantity(book.getQuantity());
        dto.setCoverImageUrl(book.getCoverImageUrl());
        dto.setPublisherBrandName(book.getPublisher().getBrandName());
        dto.setGenres(book.getGenres().stream()
                .map(genre -> genre.getName())
                .collect(Collectors.toSet()));
        return dto;
    }
}