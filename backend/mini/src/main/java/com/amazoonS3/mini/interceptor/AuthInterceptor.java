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
        // 세션에서 사용자 정보 확인
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        // 인증되지 않은 경우 로그인 페이지로 리다이렉트
        if (user == null) {
            response.sendRedirect(frontendUrl+"/login"); // 리다이렉트할 경로 설정
            return false;
        }

        return true; // 인증된 경우 요청을 진행
    }
}
