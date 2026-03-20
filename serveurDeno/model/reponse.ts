export type APIResponse<T> = APISuccess<T> | APIFailure;

interface APISuccess<T> {
    success: true;
    error?: never;
    data: T;
}

export interface APIError {
    code: APIErreurCode;
    message: string;
}

export interface APIFailure {
    success: false;
    error: APIError;
    data?: never;
}

export enum APIErreurCode {
    NOT_FOUND = "NOT_FOUND",
    BAD_REQUEST = "BAD_REQUEST",  // 400
    VALIDATION_ERROR = "VALIDATION_ERROR", // 409
    UNAUTHORIZED = "UNAUTHORIZED", // 401
    ROLE_UNAUTHORIZED = "ROLE_UNAUTHORIZED", // 403

    // Erreurs serveur
    SERVER_ERROR = "SERVER_ERROR", // 500
    TOMCAT_ERROR = "TOMCAT_ERROR", // 5xx
    TOMCAT_UNAVAILABLE = "TOMCAT_UNAVAILABLE",
    TIMEOUT = "TIMEOUT",
}

/**
 * Exception métier levée dans les routes Deno.
 * Capturée par errorMiddleware pour produire une APIFailure.
 */
export class APIException extends Error {
    readonly code: APIErreurCode;
    readonly status: number;

    constructor(code: APIErreurCode, status: number, message: string) {
        super(message);
        this.name = "APIException";
        this.code = code;
        this.status = status;
    }
}