package com.example.agentproxy.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when authentication fails or is missing.
 */
public class UnauthorizedException extends AehException {

    public UnauthorizedException() {
        super(ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    public UnauthorizedException(String userMessage) {
        super(ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, userMessage);
    }
}
