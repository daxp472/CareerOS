package com.careeros.security;

import com.careeros.domain.entity.User;
import com.careeros.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    public CareerOsUserDetailsService.CareerOsPrincipal principal() {
        Object authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof org.springframework.security.authentication.UsernamePasswordAuthenticationToken token
                && token.getPrincipal() instanceof CareerOsUserDetailsService.CareerOsPrincipal principal) {
            return principal;
        }
        throw new UnauthorizedException("Authentication required");
    }

    public Long userId() {
        return principal().getUserId();
    }

    public User user() {
        return principal().getUser();
    }
}
