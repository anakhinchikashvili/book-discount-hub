package com.bookdiscounthub.controller;

import com.bookdiscounthub.dto.OrderItemResponse;
import com.bookdiscounthub.dto.OrderRequest;
import com.bookdiscounthub.dto.OrderResponse;
import com.bookdiscounthub.security.CustomUserDetails;
import com.bookdiscounthub.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@AuthenticationPrincipal CustomUserDetails principal,
                                                    @RequestBody OrderRequest request) {
        OrderResponse order = orderService.placeOrder(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(orderService.getOrdersByUser(principal.getId()));
    }

    // Publisher Dashboard-ისთვის: მხოლოდ ამ publisher-ის წიგნებზე გაფორმებული item-ები
    @GetMapping("/publisher/my")
    public ResponseEntity<List<OrderItemResponse>> getPublisherOrders(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(orderService.getOrderItemsForPublisher(principal.getId()));
    }
}