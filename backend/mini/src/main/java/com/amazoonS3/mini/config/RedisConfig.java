package com.amazoonS3.mini.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@Configuration
    @EnableRedisHttpSession
    public class RedisConfig {
        
        @Value("${spring.redis.host}")
        private String redisHost;
        @Value("${spring.redis.port}")
        private String redisPort;

        @Bean
        public LettuceConnectionFactory redisConnectionFactory() {
            return new LettuceConnectionFactory(new RedisStandaloneConfiguration(redisHost, Integer.parseInt(redisPort)));
        }
    }
