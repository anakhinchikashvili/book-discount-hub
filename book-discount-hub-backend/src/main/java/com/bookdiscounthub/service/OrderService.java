package com.bookdiscounthub.service;

import com.bookdiscounthub.dto.OrderItemRequest;
import com.bookdiscounthub.dto.OrderItemResponse;
import com.bookdiscounthub.dto.OrderRequest;
import com.bookdiscounthub.dto.OrderResponse;
import com.bookdiscounthub.entity.*;
import com.bookdiscounthub.repository.BookRepository;
import com.bookdiscounthub.repository.OrderItemRepository;
import com.bookdiscounthub.repository.OrderRepository;
import com.bookdiscounthub.repository.PublisherProfileRepository;
import com.bookdiscounthub.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final BookRepository bookRepository;
    private final BookService bookService;
    private final UserRepository userRepository;
    private final PublisherProfileRepository publisherProfileRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        BookRepository bookRepository,
                        BookService bookService,
                        UserRepository userRepository,
                        PublisherProfileRepository publisherProfileRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.bookRepository = bookRepository;
        this.bookService = bookService;
        this.userRepository = userRepository;
        this.publisherProfileRepository = publisherProfileRepository;
    }

    /**
     * Cross-Vendor Checkout: request.items შეიძლება შეიცავდეს სხვადასხვა
     * publisher-ის წიგნებს - ერთი Order, მაგრამ თითო წიგნი ცალკე OrderItem-ია,
     * რომ მერე თითოეულმა Publisher-მა მხოლოდ საკუთარი item-ები დაინახოს.
     *
     * @Transactional მთლიან მეთოდს ერთ ტრანზაქციად აქცევს: თუ ერთ-ერთი წიგნის
     * მარაგი არასაკმარისია, მთელი შეკვეთა (და მანამდე უკვე შემცირებული მარაგებიც) rollback-დება.
     */
    @Transactional
    public OrderResponse placeOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("მომხმარებელი ვერ მოიძებნა, id=" + userId));
        if (!user.isEnabled()) {
            throw new IllegalArgumentException("ანგარიში დაბლოკილია, შეკვეთის გაფორმება შეუძლებელია");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("კალათა ცარიელია");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Book book = bookRepository.findById(itemRequest.getBookId())
                    .orElseThrow(() -> new EntityNotFoundException("წიგნი ვერ მოიძებნა, id=" + itemRequest.getBookId()));
            if (!book.isActive()) {
                throw new EntityNotFoundException("წიგნი აღარ არის ხელმისაწვდომი: " + book.getTitle());
            }

            // ფასის დაფიქსირება შესყიდვის მომენტისთვის (Price History Integrity)
            BigDecimal priceAtPurchase = book.getFinalPrice();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(book);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtPurchase(priceAtPurchase);
            orderItems.add(orderItem);

            totalPrice = totalPrice.add(priceAtPurchase.multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            // მარაგის შემცირება - თუ არასაკმარისია, აქ IllegalArgumentException-ს ისვრის
            // BookService, და მთელი @Transactional მეთოდი rollback-დება
            bookService.reduceStock(book.getId(), itemRequest.getQuantity());
        }

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(savedOrder);
    }

    public List<OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Publisher Dashboard-ისთვის: ამ publisher-ის წიგნებზე გაფორმებული ყველა
     * OrderItem - სხვა publisher-ების item-ები არ ჩანს, თუნდაც ერთ Order-ში იყოს.
     */
    public List<OrderItemResponse> getOrderItemsForPublisher(Long publisherUserId) {
        PublisherProfile profile = publisherProfileRepository.findByUserId(publisherUserId)
                .orElseThrow(() -> new EntityNotFoundException("Publisher პროფილი ვერ მოიძებნა"));
        return orderItemRepository.findByBook_Publisher_Id(profile.getId()).stream()
                .map(OrderItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Publisher-ს შეუძლია შეცვალოს მხოლოდ საკუთარი წიგნის OrderItem-ის სტატუსი -
     * ownership-შემოწმება ისევე, როგორც BookService-ში წიგნის edit/delete-ზე.
     */
    @Transactional
    public OrderItemResponse updateItemStatus(Long orderItemId, Long publisherUserId, OrderStatus newStatus) {
        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new EntityNotFoundException("შეკვეთის ერთეული ვერ მოიძებნა, id=" + orderItemId));

        PublisherProfile profile = publisherProfileRepository.findByUserId(publisherUserId)
                .orElseThrow(() -> new EntityNotFoundException("Publisher პროფილი ვერ მოიძებნა"));

        if (!item.getBook().getPublisher().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("ეს შეკვეთის ერთეული არ ეკუთვნის თქვენს ანგარიშს");
        }

        item.setStatus(newStatus);
        return OrderItemResponse.fromEntity(orderItemRepository.save(item));
    }
}