package com.bookdiscounthub.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequest {
    private String shippingAddress;
    private List<OrderItemRequest> items; // შეიძლება შეიცავდეს სხვადასხვა publisher-ის წიგნებს
}