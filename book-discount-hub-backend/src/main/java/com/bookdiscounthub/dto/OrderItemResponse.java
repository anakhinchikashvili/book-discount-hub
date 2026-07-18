package com.bookdiscounthub.dto;

import com.bookdiscounthub.entity.OrderItem;
import com.bookdiscounthub.entity.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String publisherBrandName;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
    private OrderStatus status;
    private String shippingAddress;
    private String buyerName;

    public static OrderItemResponse fromEntity(OrderItem item) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.setId(item.getId());
        dto.setBookId(item.getBook().getId());
        dto.setBookTitle(item.getBook().getTitle());
        dto.setPublisherBrandName(item.getBook().getPublisher().getBrandName());
        dto.setQuantity(item.getQuantity());
        dto.setPriceAtPurchase(item.getPriceAtPurchase());
        dto.setStatus(item.getStatus());
        dto.setShippingAddress(item.getOrder().getShippingAddress());
        dto.setBuyerName(item.getOrder().getUser().getFullName());
        return dto;
    }
}