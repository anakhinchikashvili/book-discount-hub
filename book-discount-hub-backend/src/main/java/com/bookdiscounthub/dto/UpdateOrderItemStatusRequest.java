package com.bookdiscounthub.dto;

import com.bookdiscounthub.entity.OrderStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderItemStatusRequest {
    private OrderStatus status;
}