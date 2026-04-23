package com.example.agentproxy.exception;

import org.springframework.http.HttpStatus;

/**
 * Base exception class for all AEH platform exceptions.
 * 
 * <p>This exception wraps internal errors with user-friendly messages
 * while preserving the original cause for logging purposes.</p>
 */
public class AehException extends RuntimeException {

    private final ErrorCode errorCode;
    private final HttpStatus httpStatus;
    private final String userMessage;

    /**
     * Create an AEH exception with error code and HTTP status.
     *
     * @param errorCode  the standardized error code
     * @param httpStatus the HTTP status to return
     */
    public AehException(ErrorCode errorCode, HttpStatus httpStatus) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.userMessage = errorCode.getDefaultMessage();
    }

    /**
     * Create an AEH exception with custom user message.
     *
     * @param errorCode   the standardized error code
     * @param httpStatus  the HTTP status to return
     * @param userMessage custom user-friendly message
     */
    public AehException(ErrorCode errorCode, HttpStatus httpStatus, String userMessage) {
        super(userMessage);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.userMessage = userMessage;
    }

    /**
     * Create an AEH exception wrapping a root cause.
     *
     * @param errorCode  the standardized error code
     * @param httpStatus the HTTP status to return
     * @param cause      the original exception
     */
    public AehException(ErrorCode errorCode, HttpStatus httpStatus, Throwable cause) {
        super(errorCode.getDefaultMessage(), cause);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.userMessage = errorCode.getDefaultMessage();
    }

    /**
     * Create an AEH exception with custom message and root cause.
     *
     * @param errorCode   the standardized error code
     * @param httpStatus  the HTTP status to return
     * @param userMessage custom user-friendly message
     * @param cause       the original exception
     */
    public AehException(ErrorCode errorCode, HttpStatus httpStatus, String userMessage, Throwable cause) {
        super(userMessage, cause);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.userMessage = userMessage;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getUserMessage() {
        return userMessage;
    }
}
