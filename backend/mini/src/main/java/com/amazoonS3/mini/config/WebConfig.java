package com.amazoonS3.mini.config;

import com.amazoonS3.mini.interceptor.AuthInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.session.web.http.CookieSerializer;
import java.time.Duration;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String FRONTEND_URL;
    
    @Autowired
    private AuthInterceptor authInterceptor;

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("JSESSIONID");
        serializer.setCookiePath("/");
        // 도메인 설정: 로컬 개발 환경에서는 'localhost' 사용, 배포 시에는 실제 도메인으로 설정
        serializer.setDomainName("localhost"); 
        serializer.setCookieMaxAge((int) Duration.ofHours(1).getSeconds());
        serializer.setSameSite("None"); // Cross-site 요청에서 쿠키를 보내도록 허용
        serializer.setUseSecureCookie(false); // 로컬 개발 환경에서는 false, 실제 배포 환경에서는 true 설정 필요
        return serializer;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**") // 모든 /api 경로에 대해 인터셉터 적용
                .excludePathPatterns("/api/login", "/api/register", "/api/board", "/api/reset-password", "/api/check-auth"); // 인증 필요 없는 경로
    }
}
