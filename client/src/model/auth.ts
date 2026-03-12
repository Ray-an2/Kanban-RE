export interface User {
    cpt_id: string;
    cpt_pseudo: string;
    cpt_role: string;
}

export interface LoginRequest {
    pseudo: string;
    motDePasse: string;
}

export interface RegisterRequest {
    pseudo: string;
    motDePasse: string;
    email: string;
    nom: string;
    prenom: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export function isUser(value: unknown): value is User {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as any).cpt_id === "string" &&
        typeof (value as any).cpt_pseudo === "string" &&
        typeof (value as any).cpt_role === "string"
    );
}

export function isAuthResponse(value: unknown): value is AuthResponse {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as any).token === "string" &&
        isUser((value as any).user)
    );
}
