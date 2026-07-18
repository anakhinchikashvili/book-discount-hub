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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * საბოლოო Security კონფიგურაცია JWT-ით და CORS-ით.
 * CORS აუცილებელია, რადგან ფრონტი (localhost:5173) და ბექენდი (localhost:8081)
 * ბრაუზერისთვის სხვადასხვა origin-ია.
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // საჯარო endpoint-ები
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/genres").permitAll()

                        // ADMIN-ის ფუნქციები
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // წიგნის შექმნა/რედაქტირება/წაშლა - მხოლოდ PUBLISHER
                        .requestMatchers(HttpMethod.POST, "/api/books").hasRole("PUBLISHER")
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("PUBLISHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("PUBLISHER")
                        .requestMatchers(HttpMethod.GET, "/api/books/my").hasRole("PUBLISHER")

                        // შეკვეთის გაფორმება/ისტორია - მხოლოდ USER (მყიდველი)
                        .requestMatchers(HttpMethod.POST, "/api/orders").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/orders/my").hasRole("USER")

                        // Publisher-ის საკუთარი გაყიდვების ნახვა/მართვა - მხოლოდ PUBLISHER
                        .requestMatchers(HttpMethod.GET, "/api/orders/publisher/my").hasRole("PUBLISHER")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/items/**").hasRole("PUBLISHER")

                        // დანარჩენი ყველაფერი - უბრალოდ ავტორიზებული უნდა იყოს
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // dev-ეტაპზე მხოლოდ ლოკალური Vite dev server-ი. Production-ში აქ რეალური დომენი ჩაანაცვლებს.
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}