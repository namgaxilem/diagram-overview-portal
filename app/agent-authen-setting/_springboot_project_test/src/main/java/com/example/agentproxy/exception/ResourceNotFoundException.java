package com.example.agentproxy.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a requested resource is not found.
 */
public class ResourceNotFoundException extends AehException {

    public ResourceNotFoundException() {
        super(ErrorCode.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    public ResourceNotFoundException(String userMessage) {
        super(ErrorCode.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND, userMessage);
    }

    public ResourceNotFoundException(String resourceType, Object identifier) {
        super(ErrorCode.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND,
                String.format("The %s with identifier '%s' was not found.", resourceType, identifier));
    }
}
