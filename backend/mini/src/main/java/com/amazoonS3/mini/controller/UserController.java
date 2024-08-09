package com.amazoonS3.mini.controller;

import com.amazoonS3.mini.model.User;
import com.amazoonS3.mini.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

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
        idCookie.setDomain("localhost"); // 또는 설정된 도메인
        idCookie.setMaxAge(3600); // 1시간

        response.addCookie(idCookie);
        return ResponseEntity.ok().build();
    }

    return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Authentication Failed");
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
