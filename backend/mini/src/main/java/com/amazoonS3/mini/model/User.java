package com.amazoonS3.mini.model;

import java.io.Serializable;

public class User implements Serializable {
    
    private static final long serialVersionUID = 1L; // 권장 사항

    private String username;
    private String email;
    private String password;

    // Getters and Setters

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
