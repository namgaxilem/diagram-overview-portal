package com.example.agentproxy.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when an external service call fails.
 */
public class ServiceException extends AehException {

    public ServiceException() {
        super(ErrorCode.SERVICE_UNAVAILABLE, HttpStatus.SERVICE_UNAVAILABLE);
    }

    public ServiceException(String userMessage) {
        super(ErrorCode.SERVICE_UNAVAILABLE, HttpStatus.SERVICE_UNAVAILABLE, userMessage);
    }

    public ServiceException(String userMessage, Throwable cause) {
        super(ErrorCode.SERVICE_UNAVAILABLE, HttpStatus.SERVICE_UNAVAILABLE, userMessage, cause);
    }

    public ServiceException(ErrorCode errorCode, HttpStatus httpStatus, String userMessage, Throwable cause) {
        super(errorCode, httpStatus, userMessage, cause);
    }
}
