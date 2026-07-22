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

    // მყიდველის მონაცემები, ლოჯისტიკური მიზნით - Publisher-ს რომ შეეძლოს რეალურად გაგზავნა.
    // ეს ველები Order-იდან (მშობელი) მოდის, არა OrderItem-იდან.
    private String buyerFullName;
    private String shippingAddress;
    private String phoneNumber;

    public static OrderItemResponse fromEntity(OrderItem item) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.setId(item.getId());
        dto.setBookId(item.getBook().getId());
        dto.setBookTitle(item.getBook().getTitle());
        dto.setPublisherBrandName(item.getBook().getPublisher().getBrandName());
        dto.setQuantity(item.getQuantity());
        dto.setPriceAtPurchase(item.getPriceAtPurchase());
        dto.setStatus(item.getStatus());
        dto.setBuyerFullName(item.getOrder().getUser().getFullName());
        dto.setShippingAddress(item.getOrder().getShippingAddress());
        dto.setPhoneNumber(item.getOrder().getPhoneNumber());
        return dto;
    }
}