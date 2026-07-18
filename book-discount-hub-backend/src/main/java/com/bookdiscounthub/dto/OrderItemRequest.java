package com.bookdiscounthub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequest {
    private Long bookId;
    private Integer quantity;
}