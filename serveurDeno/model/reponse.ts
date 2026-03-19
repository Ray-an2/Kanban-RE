// ============================================================
// Modèle de réponse unifié de l'API Deno
// ============================================================

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
    // Erreurs client
    NOT_FOUND        = "NOT_FOUND",         // 404 — ressource introuvable
    BAD_REQUEST      = "BAD_REQUEST",        // 400 — corps / paramètres invalides
    VALIDATION_ERROR = "VALIDATION_ERROR",   // 409 — conflit (pseudo déjà pris, etc.)
    UNAUTHORIZED     = "UNAUTHORIZED",       // 401 — token absent ou invalide
    ROLE_UNAUTHORIZED = "ROLE_UNAUTHORIZED", // 403 — droits insuffisants

    // Erreurs serveur
    SERVER_ERROR     = "SERVER_ERROR",       // 500 — erreur interne Deno
    TOMCAT_ERROR     = "TOMCAT_ERROR",       // 5xx — erreur retournée par Tomcat
    TOMCAT_UNAVAILABLE = "TOMCAT_UNAVAILABLE", // réseau KO, Tomcat injoignable
    TIMEOUT          = "TIMEOUT",            // délai dépassé
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