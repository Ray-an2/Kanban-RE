import { Context, State } from "@oak/oak";
import {User} from "./user.ts";

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

export interface AuthPayload {
    pseudo: string;
    role: string;
    exp: number;
}

export interface AuthContext extends Context {
    state: AuthState;
    params: Record<string, string>;
}

export interface AuthState extends State {
    user?: AuthPayload;
}

export function isAuthPayload(value: unknown): value is AuthPayload {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as any).pseudo === "string" &&
        typeof (value as any).role === "string" &&
        typeof (value as any).exp === "number"
    );
}
