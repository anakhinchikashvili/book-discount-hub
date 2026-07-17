package com.bookdiscounthub.service;

import com.bookdiscounthub.dto.BookRequest;
import com.bookdiscounthub.dto.BookResponse;
import com.bookdiscounthub.entity.Book;
import com.bookdiscounthub.entity.Genre;
import com.bookdiscounthub.entity.PublisherProfile;
import com.bookdiscounthub.entity.VerificationStatus;
import com.bookdiscounthub.repository.BookRepository;
import com.bookdiscounthub.repository.GenreRepository;
import com.bookdiscounthub.repository.PublisherProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final PublisherProfileRepository publisherProfileRepository;
    private final GenreRepository genreRepository;

    public BookService(BookRepository bookRepository,
                       PublisherProfileRepository publisherProfileRepository,
                       GenreRepository genreRepository) {
        this.bookRepository = bookRepository;
        this.publisherProfileRepository = publisherProfileRepository;
        this.genreRepository = genreRepository;
    }

    // ---------- კითხვის ოპერაციები (public კატალოგი) ----------

    public List<BookResponse> getAllActiveBooks() {
        return bookRepository.findByActiveTrue().stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public BookResponse getBookById(Long bookId) {
        Book book = getActiveBookOrThrow(bookId);
        return BookResponse.fromEntity(book);
    }

    public List<BookResponse> searchBooks(String keyword) {
        return bookRepository.searchByKeyword(keyword).stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BookResponse> getBooksByGenre(Long genreId) {
        return bookRepository.findByGenres_IdAndActiveTrue(genreId).stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Publisher Dashboard-ისთვის: publisherUserId არის User.id (არა PublisherProfile.id)
    public List<BookResponse> getBooksByPublisher(Long publisherUserId) {
        PublisherProfile profile = getProfileByUserIdOrThrow(publisherUserId);
        return bookRepository.findByPublisherIdAndActiveTrue(profile.getId()).stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ---------- Publisher-ის CRUD ოპერაციები ----------

    @Transactional
    public BookResponse createBook(Long publisherUserId, BookRequest request) {
        PublisherProfile profile = getApprovedProfileOrThrow(publisherUserId);

        Book book = new Book();
        applyRequestToBook(book, request);
        book.setPublisher(profile);

        return BookResponse.fromEntity(bookRepository.save(book));
    }

    @Transactional
    public BookResponse updateBook(Long bookId, Long publisherUserId, BookRequest request) {
        Book book = getOwnedActiveBookOrThrow(bookId, publisherUserId);
        applyRequestToBook(book, request);
        return BookResponse.fromEntity(bookRepository.save(book));
    }

    /**
     * Soft delete: ბაზიდან არ იშლება, უბრალოდ active=false.
     * ძველი Order/OrderItem ჩანაწერები არ ზიანდება.
     */
    @Transactional
    public void deleteBook(Long bookId, Long publisherUserId) {
        Book book = getOwnedActiveBookOrThrow(bookId, publisherUserId);
        book.setActive(false);
        bookRepository.save(book);
    }

    private void applyRequestToBook(Book book, BookRequest request) {
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setDiscountPercentage(request.getDiscountPercentage() != null ? request.getDiscountPercentage() : 0);
        book.setQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
        book.setCoverImageUrl(request.getCoverImageUrl());

        if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()) {
            Set<Genre> genres = new HashSet<>(genreRepository.findAllById(request.getGenreIds()));
            book.setGenres(genres);
        }
    }

    // ---------- მარაგის მართვა (შემდეგ ეტაპზე OrderService გამოიყენებს) ----------

    /**
     * ამცირებს მარაგს შეკვეთის გაფორმებისას. თუ საკმარისი მარაგი არაა, ჩავარდება.
     * @Transactional უზრუნველყოფს, რომ ერთდროული შეკვეთების დროს race condition არ მოხდეს.
     */
    @Transactional
    public void reduceStock(Long bookId, int quantityToReduce) {
        Book book = getActiveBookOrThrow(bookId);
        if (book.getQuantity() < quantityToReduce) {
            throw new IllegalArgumentException(
                    "არასაკმარისი მარაგი წიგნისთვის: " + book.getTitle() +
                            " (ხელმისაწვდომია: " + book.getQuantity() + ", მოთხოვნილია: " + quantityToReduce + ")");
        }
        book.setQuantity(book.getQuantity() - quantityToReduce);
        bookRepository.save(book);
    }

    // ---------- დამხმარე მეთოდები ----------

    private Book getActiveBookOrThrow(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("წიგნი ვერ მოიძებნა, id=" + bookId));
        if (!book.isActive()) {
            throw new EntityNotFoundException("წიგნი წაშლილია, id=" + bookId);
        }
        return book;
    }

    // ამოწმებს, რომ წიგნი ნამდვილად ეკუთვნის მოთხოვნის გამომგზავნ Publisher-ს
    private Book getOwnedActiveBookOrThrow(Long bookId, Long publisherUserId) {
        Book book = getActiveBookOrThrow(bookId);
        PublisherProfile profile = getProfileByUserIdOrThrow(publisherUserId);
        if (!book.getPublisher().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("ეს წიგნი არ ეკუთვნის თქვენს ანგარიშს");
        }
        return book;
    }

    private PublisherProfile getProfileByUserIdOrThrow(Long userId) {
        return publisherProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Publisher პროფილი ვერ მოიძებნა ამ მომხმარებლისთვის"));
    }

    private PublisherProfile getApprovedProfileOrThrow(Long userId) {
        PublisherProfile profile = getProfileByUserIdOrThrow(userId);
        if (profile.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new IllegalArgumentException(
                    "წიგნის დამატება შეუძლებელია - თქვენი ანგარიში ჯერ არ არის ადმინის მიერ დამტკიცებული");
        }
        return profile;
    }
}