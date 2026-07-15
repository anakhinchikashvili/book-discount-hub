package com.bookdiscounthub.repository;

import com.bookdiscounthub.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // მომხმარებლის საკუთარი შეკვეთების ისტორია
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
}