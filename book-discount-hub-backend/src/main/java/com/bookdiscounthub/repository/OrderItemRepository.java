package com.bookdiscounthub.repository;

import com.bookdiscounthub.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Publisher Dashboard-ისთვის: ამ გამომცემლის წიგნებზე გაფორმებული ყველა შეკვეთის item
    List<OrderItem> findByBook_Publisher_Id(Long publisherId);
}