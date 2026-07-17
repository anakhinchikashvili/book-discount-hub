package com.bookdiscounthub.dto;

import com.bookdiscounthub.entity.Role;
import com.bookdiscounthub.entity.User;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity-ს (User) პირდაპირ არასდროს ვაბრუნებთ API-დან,
 * რადგან მასში ჰეშირებული password ველიც შედის. ამის ნაცვლად DTO.
 */
@Getter
@Setter
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private boolean enabled;

    public static UserResponse fromEntity(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setEnabled(user.isEnabled());
        return dto;
    }
}