package com.bookdiscounthub.security;

import com.bookdiscounthub.entity.Role;
import com.bookdiscounthub.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Spring Security მუშაობს UserDetails-ის საშუალებით, არა პირდაპირ ჩვენი User entity-ით.
 * ეს wrapper-კლასი გვაძლევს წვდომას User.id-ზეც (რაც პირდაპირ UserDetails-ს არ აქვს),
 * რომ Controller-ებში @AuthenticationPrincipal-იდან userId ადვილად ამოვიღოთ.
 */
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public Long getId() {
        return user.getId();
    }

    public Role getRole() {
        return user.getRole();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isEnabled(); // ADMIN-ის blockUser() აქ პირდაპირ აისახება
    }
}