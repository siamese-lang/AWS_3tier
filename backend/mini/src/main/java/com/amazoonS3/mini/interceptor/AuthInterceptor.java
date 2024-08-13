package com.amazoonS3.mini.interceptor;

import com.amazoonS3.mini.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);

        // 예외 처리할 경로
        String uri = request.getRequestURI();
        if ("/api/check-auth".equals(uri) || "/api/login".equals(uri) || "/api/register".equals(uri) || "/api/board".equals(uri)) {
            return true;
        }

        // 세션이 존재하고, 인증 정보가 있으면 인터셉터 통과
        if (session != null && session.getAttribute("user") != null) {
            return true;
        }
        
        // 세션이 없거나 인증 정보가 없는 경우
        response.sendRedirect("/login");
        return false;
    }

}
