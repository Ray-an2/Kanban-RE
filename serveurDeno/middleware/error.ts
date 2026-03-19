import { Context, Next } from "@oak/oak";
import { APIErreurCode, APIException, APIFailure } from "../model/reponse.ts";

// ============================================================
// Middleware de gestion centralisée des erreurs
// ============================================================

export async function errorMiddleware(ctx: Context, next: Next) {
    try {
        await next();
    } catch (err) {

        // --- 1. Erreur métier Deno (APIException levée manuellement) ---
        if (err instanceof APIException) {
            const body: APIFailure = {
                success: false,
                error: { code: err.code, message: err.message },
            };
            ctx.response.status = err.status;
            ctx.response.body = body;
            console.error(`[API ERROR ${err.status}] ${err.code}: ${err.message}`);
            return;
        }

        // --- 2. Erreur réseau : Tomcat injoignable ---
        // TypeError est levé par fetch() quand la connexion est refusée
        if (err instanceof TypeError && err.message.includes("error trying to connect")) {
            const body: APIFailure = {
                success: false,
                error: {
                    code: APIErreurCode.TOMCAT_UNAVAILABLE,
                    message: "Le serveur de traitement est actuellement indisponible. Réessayez dans quelques instants.",
                },
            };
            ctx.response.status = 503;
            ctx.response.body = body;
            console.error("[TOMCAT UNAVAILABLE]", err.message);
            return;
        }

        // --- 3. Erreur inconnue ---
        console.error("[UNEXPECTED ERROR]", err);
        const body: APIFailure = {
            success: false,
            error: {
                code: APIErreurCode.SERVER_ERROR,
                message: "Une erreur inattendue s'est produite.",
            },
        };
        ctx.response.status = 500;
        ctx.response.body = body;
    }
}