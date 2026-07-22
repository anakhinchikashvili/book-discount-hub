package com.bookdiscounthub.dto;

import com.bookdiscounthub.entity.Order;
import com.bookdiscounthub.entity.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class OrderResponse {
    private Long id;
    private OrderStatus status;
    private BigDecimal totalPrice;
    private String shippingAddress;
    private String phoneNumber;
    private BigDecimal shippingFee;
    private LocalDateTime orderDate;
    private List<OrderItemResponse> items;

    public static OrderResponse fromEntity(Order order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setShippingFee(order.getShippingFee());
        dto.setOrderDate(order.getOrderDate());
        dto.setItems(order.getItems().stream()
                .map(OrderItemResponse::fromEntity)
                .collect(Collectors.toList()));
        return dto;
    }
}