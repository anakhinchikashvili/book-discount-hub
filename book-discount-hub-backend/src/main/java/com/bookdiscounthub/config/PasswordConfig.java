package com.bookdiscounthub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * ჯერჯერობით მხოლოდ PasswordEncoder, რომ რეგისტრაციისას პაროლი დაჰეშდეს.
 * სრული Spring Security + JWT კონფიგურაცია (SecurityFilterChain, JWT filter,
 * როლებზე დაფუძნებული endpoint-დაცვა) მომდევნო ეტაპზე მოვა ცალკე კლასში.
 */
@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}