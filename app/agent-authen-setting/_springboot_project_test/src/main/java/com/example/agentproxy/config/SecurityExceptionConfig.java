package com.example.agentproxy.config;

import com.example.agentproxy.dto.ErrorResponse;
import com.example.agentproxy.exception.ErrorCode;
import com.example.agentproxy.filter.CorrelationIdFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.time.Instant;

/**
 * Configuration for handling Spring Security exceptions with standardized AEH error responses.
 */
@Configuration
public class SecurityExceptionConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityExceptionConfig.class);

    private final ObjectMapper objectMapper;

    public SecurityExceptionConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            String correlationId = getCorrelationId(request);
            log.warn("[{}] Authentication required: {}", correlationId, authException.getMessage());

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .timestamp(Instant.now())
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .errorCode(ErrorCode.UNAUTHORIZED.getCode())
                    .message(ErrorCode.UNAUTHORIZED.getDefaultMessage())
                    .path(request.getRequestURI())
                    .correlationId(correlationId)
                    .build();

            writeErrorResponse(response, HttpStatus.UNAUTHORIZED, errorResponse);
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            String correlationId = getCorrelationId(request);
            log.warn("[{}] Access denied: {}", correlationId, accessDeniedException.getMessage());

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .timestamp(Instant.now())
                    .status(HttpStatus.FORBIDDEN.value())
                    .errorCode(ErrorCode.ACCESS_DENIED.getCode())
                    .message(ErrorCode.ACCESS_DENIED.getDefaultMessage())
                    .path(request.getRequestURI())
                    .correlationId(correlationId)
                    .build();

            writeErrorResponse(response, HttpStatus.FORBIDDEN, errorResponse);
        };
    }

    private void writeErrorResponse(HttpServletResponse response, HttpStatus status, ErrorResponse errorResponse) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    private String getCorrelationId(HttpServletRequest request) {
        Object correlationId = request.getAttribute(CorrelationIdFilter.CORRELATION_ID_MDC_KEY);
        return correlationId != null ? correlationId.toString() : "unknown";
    }
}
