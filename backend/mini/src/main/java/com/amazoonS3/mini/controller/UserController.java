package com.amazoonS3.mini.controller;

import com.amazoonS3.mini.model.User;
import com.amazoonS3.mini.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Value("${domainName}")
    private String domainName;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public void registerUser(
        @RequestParam String username,
        @RequestParam String email,
        @RequestParam String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        userService.registerUser(user);
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam String username, @RequestParam String password, HttpServletRequest request, HttpServletResponse response) {
        User user = userService.authenticateUser(username, password);

        if (user != null) {
            HttpSession session = request.getSession(true); // 새로운 세션 생성
            session.setAttribute("user", user);

            Cookie idCookie = new Cookie("JSESSIONID", session.getId());
            idCookie.setHttpOnly(true);
            idCookie.setSecure(true);
            idCookie.setPath("/");
            idCookie.setDomain(domainName); // 또는 설정된 도메인

            // 현재 시간을 서울 시간으로 가져온 후, 1시간 후의 시간을 UTC로 변환
            ZonedDateTime expiration = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).plusDays(1);
            String expires = expiration.withZoneSameInstant(ZoneId.of("UTC")).format(DateTimeFormatter.RFC_1123_DATE_TIME);
            response.addHeader("Set-Cookie", "JSESSIONID=" + session.getId() + "; Expires=" + expires + "; Path=/; Domain=" + domainName + "; Secure; HttpOnly; SameSite=None");

            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // 세션 무효화
        }
        return ResponseEntity.ok().body("Logged out successfully");
    }

    @PostMapping("/reset-password")
    public void resetPassword(
        @RequestParam String username,
        @RequestParam String newPassword) {
        userService.resetPassword(username, newPassword);
    }
}
