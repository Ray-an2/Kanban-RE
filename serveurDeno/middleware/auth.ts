import { Next } from "@oak/oak";
import { verifyJWT } from "./jwt.ts";
import { APIErreurCode, APIException } from "../model/reponse.ts";
import { AuthContext } from "../model/auth.ts";

export async function authMiddleware(ctx: AuthContext, next: Next) {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        /*
         * BUG CORRIGÉ : VALIDATION_ERROR + 409 pour un token manquant
         * est sémantiquement incorrect.
         * 401 Unauthorized est le code standard pour une authentification
         * absente ou mal formée.
         */
        throw new APIException(
            APIErreurCode.UNAUTHORIZED,
            401,
            "Token manquant ou mal formé. Fournir un header Authorization: Bearer <token>.",
        );
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);

    if (!payload) {
        throw new APIException(
            APIErreurCode.UNAUTHORIZED,
            401,
            "Token invalide ou expiré.",
        );
    }

    ctx.state.user = payload;
    await next();
}