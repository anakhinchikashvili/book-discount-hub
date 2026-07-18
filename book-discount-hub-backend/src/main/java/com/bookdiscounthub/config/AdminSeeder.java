package com.bookdiscounthub.config;

import com.bookdiscounthub.entity.Role;
import com.bookdiscounthub.entity.User;
import com.bookdiscounthub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Dev-ეტაპისთვის: აპლიკაციის ყოველი გაშვებისას ამოწმებს, არსებობს თუ არა
 * ერთი მაინც ADMIN ანგარიში, და თუ არა - ქმნის ერთს application.properties-ში
 * მითითებული email/password-ით.
 *
 * ⚠️ production-ისთვის ეს არასწორია (hardcoded/properties-ში ღია password) -
 * production-ში ეს ან ცალკე one-off admin CLI ბრძანებით უნდა კეთდებოდეს,
 * ან migration script-ით.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.seed.email}")
    private String adminEmail;

    @Value("${admin.seed.password}")
    private String adminPassword;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        boolean adminExists = userRepository.findByEmail(adminEmail).isPresent();
        if (adminExists) {
            return;
        }

        User admin = new User();
        admin.setFullName("System Admin");
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        admin.setEnabled(true);
        userRepository.save(admin);

        System.out.println("✅ Admin ანგარიში შეიქმნა: " + adminEmail);
    }
}