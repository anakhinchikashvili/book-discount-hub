package com.bookdiscounthub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * ⚠️ დროებითი კონფიგურაცია, მხოლოდ დეველოპმენტისთვის.
 * ყველა /api/** მოთხოვნას ღიად ტოვებს, ავტორიზაციის გარეშე.
 * ეს გვჭირდება, რომ Postman-ით ტესტვა შესაძლებელი იყოს, სანამ JWT დაინერგება.
 *
 * მე-5 ეტაპზე (Spring Security + JWT) ეს კლასი მთლიანად ჩანაცვლდება:
 * - authorizeHttpRequests-ში კონკრეტული როლების მიხედვით წვდომა დაწესდება
 *   (მაგ. /api/admin/** მხოლოდ ADMIN-ს, /api/books POST მხოლოდ PUBLISHER-ს)
 * - დაემატება JWT ვალიდაციის filter
 * - session-ის მართვა STATELESS გახდება
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}