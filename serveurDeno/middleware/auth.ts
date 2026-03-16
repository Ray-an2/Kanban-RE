import { Next } from "@oak/oak";
import { verifyJWT } from "./jwt.ts";
import { APIErreurCode, APIException } from "../model/reponse.ts";
import { AuthContext } from "../model/auth.ts";

export async function authMiddleware(ctx: AuthContext, next: Next) {
    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new APIException(
            APIErreurCode.VALIDATION_ERROR,
            409,
            "token manquante ou mal formée",
        );
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);
    if (!payload) {
        throw new APIException(
            APIErreurCode.UNAUTHORIZED,
            401,
            "token invalide ou expiré",
        );
    }

    ctx.state.user = payload;
    await next();
}
