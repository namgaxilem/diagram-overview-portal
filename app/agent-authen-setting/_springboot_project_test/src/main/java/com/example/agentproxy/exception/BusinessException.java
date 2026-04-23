package com.example.agentproxy.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a business rule is violated.
 */
public class BusinessException extends AehException {

    public BusinessException() {
        super(ErrorCode.BUSINESS_RULE_VIOLATION, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    public BusinessException(String userMessage) {
        super(ErrorCode.BUSINESS_RULE_VIOLATION, HttpStatus.UNPROCESSABLE_ENTITY, userMessage);
    }

    public BusinessException(ErrorCode errorCode, String userMessage) {
        super(errorCode, HttpStatus.UNPROCESSABLE_ENTITY, userMessage);
    }

    public BusinessException(String userMessage, Throwable cause) {
        super(ErrorCode.BUSINESS_RULE_VIOLATION, HttpStatus.UNPROCESSABLE_ENTITY, userMessage, cause);
    }
}
