package com.example.agentproxy.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when user lacks permission to access a resource.
 */
public class AccessDeniedException extends AehException {

    public AccessDeniedException() {
        super(ErrorCode.ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    public AccessDeniedException(String userMessage) {
        super(ErrorCode.ACCESS_DENIED, HttpStatus.FORBIDDEN, userMessage);
    }
}
