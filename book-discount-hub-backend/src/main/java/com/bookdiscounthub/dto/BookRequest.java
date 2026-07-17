package com.bookdiscounthub.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
public class BookRequest {

    private String title;
    private String author;
    private String description;
    private BigDecimal price;
    private Integer discountPercentage;
    private Integer quantity;
    private String coverImageUrl;
    private Set<Long> genreIds; // შერჩეული ჟანრების id-ები
}