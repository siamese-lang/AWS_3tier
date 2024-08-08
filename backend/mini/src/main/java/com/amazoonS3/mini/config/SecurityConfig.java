package com.amazoonS3.mini.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                    .requestMatchers("/register", "/api/register", "/api/login", "/api/reset-password").permitAll() // Allow unauthenticated access
                    .anyRequest().authenticated() // All other requests require authentication
            )
            .formLogin(formLogin ->
                formLogin
                    .loginProcessingUrl("/api/login")
                    .successHandler((request, response, authentication) -> 
                        response.sendRedirect(frontendUrl + "/home") // Redirect to /home on the frontend after successful login
                    )
                    .permitAll()
            )
            .logout(logout ->
                logout
                    .logoutUrl("/api/logout")
                    .logoutSuccessHandler((request, response, authentication) -> 
                        response.sendRedirect(frontendUrl + "/login?logout") // Redirect to /login on the frontend after logout
                    )
                    .permitAll()
            )
            .exceptionHandling(exceptionHandling ->
                exceptionHandling
                    .authenticationEntryPoint((request, response, authException) -> 
                        response.sendRedirect(frontendUrl + "/login") // Redirect to /login on the frontend if not authenticated
                    )
            )
            .addFilterBefore(new CustomAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class); // Optional: Custom filter if needed

        return http.build();
    }
}
