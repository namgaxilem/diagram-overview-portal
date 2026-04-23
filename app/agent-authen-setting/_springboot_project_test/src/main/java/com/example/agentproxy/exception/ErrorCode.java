package com.example.agentproxy.exception;

/**
 * Standardized error codes for AEH platform.
 * Each code maps to a category and default user-friendly message.
 */
public enum ErrorCode {

    // General errors (1xxx)
    INTERNAL_ERROR("AEH-1000", "An unexpected error occurred. Please try again later."),
    VALIDATION_ERROR("AEH-1001", "The request contains invalid data."),
    INVALID_REQUEST("AEH-1002", "The request could not be processed."),

    // Authentication & Authorization errors (2xxx)
    UNAUTHORIZED("AEH-2000", "Authentication is required to access this resource."),
    ACCESS_DENIED("AEH-2001", "You do not have permission to access this resource."),
    INVALID_CREDENTIALS("AEH-2002", "The provided credentials are invalid."),

    // Resource errors (3xxx)
    RESOURCE_NOT_FOUND("AEH-3000", "The requested resource was not found."),
    RESOURCE_ALREADY_EXISTS("AEH-3001", "The resource already exists."),
    RESOURCE_CONFLICT("AEH-3002", "The resource is in a conflicting state."),

    // External service errors (4xxx)
    SERVICE_UNAVAILABLE("AEH-4000", "The service is temporarily unavailable. Please try again later."),
    BACKEND_ERROR("AEH-4001", "An error occurred while communicating with the backend service."),
    TIMEOUT_ERROR("AEH-4002", "The request timed out. Please try again."),

    // Business logic errors (5xxx)
    BUSINESS_RULE_VIOLATION("AEH-5000", "The operation violates business rules."),
    OPERATION_NOT_ALLOWED("AEH-5001", "This operation is not allowed.");

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() {
        return code;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
