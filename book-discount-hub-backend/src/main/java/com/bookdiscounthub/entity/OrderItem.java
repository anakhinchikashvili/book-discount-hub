package com.bookdiscounthub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private Integer quantity;

    // შესყიდვის მომენტში ფასის დაფიქსირება (მოგვიანებით ფასდაკლების ცვლილება რომ არ იმოქმედოს ისტორიაზე)
    @Column(nullable = false)
    private BigDecimal priceAtPurchase;

    /**
     * სტატუსი ინახება item-ის დონეზე, არა Order-ის დონეზე - რადგან ერთ Order-ში
     * შეიძლება რამდენიმე Publisher-ის წიგნი იყოს, თითოეულმა თავისი მიწოდების
     * პროგრესი დამოუკიდებლად უნდა მართოს (ერთმა Publisher-მა SHIPPED რომ დააყენოს,
     * მეორის item-ს არ უნდა შეეხოს).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
}