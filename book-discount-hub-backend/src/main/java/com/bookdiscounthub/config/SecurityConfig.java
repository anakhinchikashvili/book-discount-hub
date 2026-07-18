package com.bookdiscounthub.config;

import com.bookdiscounthub.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * საბოლოო Security კონფიგურაცია JWT-ით.
 * წინა, დროებითი "permitAll ყველგან" ვერსია ამით ჩანაცვლდა.
 */
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // საჯარო endpoint-ები
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()

                        // ADMIN-ის ფუნქციები
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // წიგნის შექმნა/რედაქტირება/წაშლა - მხოლოდ PUBLISHER
                        .requestMatchers(HttpMethod.POST, "/api/books").hasRole("PUBLISHER")
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("PUBLISHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("PUBLISHER")

                        // დანარჩენი ყველაფერი (შეკვეთები და ა.შ.) - უბრალოდ ავტორიზებული უნდა იყოს
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}