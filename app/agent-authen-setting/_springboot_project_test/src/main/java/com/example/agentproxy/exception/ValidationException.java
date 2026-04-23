package com.example.agentproxy.exception;

import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.Map;

/**
 * Exception thrown when request validation fails.
 */
public class ValidationException extends AehException {

    private final Map<String, String> fieldErrors;

    public ValidationException() {
        super(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
        this.fieldErrors = Collections.emptyMap();
    }

    public ValidationException(String userMessage) {
        super(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, userMessage);
        this.fieldErrors = Collections.emptyMap();
    }

    public ValidationException(Map<String, String> fieldErrors) {
        super(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
        this.fieldErrors = fieldErrors != null ? fieldErrors : Collections.emptyMap();
    }

    public ValidationException(String userMessage, Map<String, String> fieldErrors) {
        super(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, userMessage);
        this.fieldErrors = fieldErrors != null ? fieldErrors : Collections.emptyMap();
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
