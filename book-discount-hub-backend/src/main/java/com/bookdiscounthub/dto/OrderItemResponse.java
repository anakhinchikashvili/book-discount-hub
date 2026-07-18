package com.bookdiscounthub.dto;

import com.bookdiscounthub.entity.OrderItem;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemResponse {
    private Long bookId;
    private String bookTitle;
    private String publisherBrandName;
    private Integer quantity;
    private BigDecimal priceAtPurchase;

    public static OrderItemResponse fromEntity(OrderItem item) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.setBookId(item.getBook().getId());
        dto.setBookTitle(item.getBook().getTitle());
        dto.setPublisherBrandName(item.getBook().getPublisher().getBrandName());
        dto.setQuantity(item.getQuantity());
        dto.setPriceAtPurchase(item.getPriceAtPurchase());
        return dto;
    }
}