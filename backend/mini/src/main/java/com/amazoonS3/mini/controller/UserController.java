package com.amazoonS3.mini.controller;

import com.amazoonS3.mini.model.User;
import com.amazoonS3.mini.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public void registerUser(@RequestBody User user) {
        userService.registerUser(user);
    }

    @PostMapping("/login")
    public void loginUser(@RequestParam String username, @RequestParam String password) {
        userService.authenticateUser(username, password);
    }

    @PostMapping("/reset-password")
    public void resetPassword(@RequestParam String username, @RequestParam String newPassword) {
        userService.resetPassword(username, newPassword);
    }
}
