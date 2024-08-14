package com.amazoonS3.mini.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.amazoonS3.mini.model.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
public class AuthController {

    @GetMapping("/api/check-authentication")
    public ResponseEntity<Void> checkAuthentication(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("user") != null) {
            return ResponseEntity.ok().build(); // User is authenticated
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // User is not authenticated
    }

    @GetMapping("/api/check-auth")
    public ResponseEntity<Map<String, Object>> checkAuth(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // Do not create a new session
        Map<String, Object> response = new HashMap<>();
        if (session != null && session.getAttribute("user") != null) {
            User user = (User) session.getAttribute("user");
            response.put("authenticated", true);
            response.put("username", user.getUsername());
        } else {
            response.put("authenticated", false);
        }
        return ResponseEntity.ok(response);
    }
}
