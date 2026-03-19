import { Router } from "@oak/oak";
import { db } from "../main.ts";

import { isCompteRow, compteRowToApi } from "../model/db.ts";
import { APIErreurCode, APIException, APIResponse } from "../model/reponse.ts";
import {type AuthResponse, type LoginRequest, type RegisterRequest, type AuthContext,} from "../model/auth.ts";
import { type User } from "../model/user.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { createJWT, hashPassword, verifyPassword } from "../middleware/jwt.ts";

const router = new Router({ prefix: "/auth" });

// URL du serveur Tomcat
const TOMCAT_BASE_URL = Deno.env.get("TOMCAT_BASE_URL");

// POST /auth/inscription
router.post("/inscription", async (ctx) => {
    const body = (await ctx.request.body.json()) as RegisterRequest;

    /* --- Validation des champs --- */
    if (!body?.pseudo || !body?.motDePasse || !body?.email || !body?.nom || !body?.prenom) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Champs manquants : pseudo, motDePasse, email, nom et prenom sont obligatoires.",
        );
    }

    if (body.pseudo.trim().length < 3) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Le pseudo doit contenir au moins 3 caractères.",
        );
    }

    if (body.motDePasse.length < 6) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Le mot de passe doit contenir au moins 6 caractères.",
        );
    }

    /* --- Vérification pseudo disponible --- */
    const existing = db.prepare(`
        SELECT cpt_id FROM t_compte_cpt WHERE cpt_pseudo = ?;
    `).get(body.pseudo);

    if (existing) {
        throw new APIException(
            APIErreurCode.VALIDATION_ERROR,
            409,
            "Ce pseudo est déjà utilisé.",
        );
    }

    const passwordHash = await hashPassword(body.motDePasse);

    if (!TOMCAT_BASE_URL) {
        throw new APIException(
            APIErreurCode.SERVER_ERROR,
            500,
            "Configuration serveur manquante (TOMCAT_BASE_URL).",
        );
    }

    const tomcatResponse = await fetch(`${TOMCAT_BASE_URL}/api/compte`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            pseudo: body.pseudo,
            mdp: passwordHash,   // hash scrypt déjà calculé
            role: "U",           // rôle utilisateur par défaut
            nom: body.nom,
            prenom: body.prenom,
            mail: body.email,
        }),
    });

    if (!tomcatResponse.ok) {
        // Extraire le message d'erreur Tomcat si disponible
        let message = "Erreur lors de la création du compte.";
        try {
            const json = await tomcatResponse.json();
            message = json.message ?? message;
        } catch {  }

        throw new APIException(
            tomcatResponse.status === 409
                ? APIErreurCode.VALIDATION_ERROR
                : APIErreurCode.TOMCAT_ERROR,
            tomcatResponse.status,
            message,
        );
    }

    const created = await tomcatResponse.json();

    const user: User = {
        cpt_id: created.id,
        cpt_pseudo: created.pseudo,
        cpt_role: created.role ?? "U",
    };

    const response: APIResponse<User> = {
        success: true,
        data: user,
    };

    ctx.response.status = 201;
    ctx.response.body = response;
});

// ============================================================
// POST /auth/login
// ============================================================
/**
 * Flux :
 *  1. Deno lit le compte dans SQLite (hash + rôle).
 *  2. Deno vérifie le mot de passe (scrypt + pepper).
 *  3. Deno génère et retourne un JWT signé.
 *
 * Le login reste entièrement côté Deno car :
 *   - La vérification scrypt nécessite le PASSWORD_PEPPER (secret Deno).
 *   - Le JWT_SECRET est aussi un secret Deno.
 *   - Pas besoin de roundtrip Tomcat pour une simple lecture + vérification.
 */
router.post("/login", async (ctx) => {
    const body = (await ctx.request.body.json()) as LoginRequest;

    if (!body?.pseudo || !body?.motDePasse) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Champs manquants : pseudo et motDePasse sont obligatoires.",
        );
    }

    // Lecture du compte dans SQLite local
    const row = db.prepare(`
        SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
        FROM t_compte_cpt
        WHERE cpt_pseudo = ?;
    `).get(body.pseudo);

    if (!row || !isCompteRow(row)) {
        throw new APIException(
            APIErreurCode.UNAUTHORIZED,
            401,
            "Identifiants invalides.",
        );
    }

    // Vérification du mot de passe (scrypt + pepper)
    const ok = await verifyPassword(body.motDePasse, row.cpt_mdp);
    if (!ok) {
        throw new APIException(
            APIErreurCode.UNAUTHORIZED,
            401,
            "Identifiants invalides.",
        );
    }

    // Génération du JWT
    const token = await createJWT({
        cpt_id: row.cpt_id,
        cpt_pseudo: row.cpt_pseudo,
        role: row.cpt_role,
    });

    const response: APIResponse<AuthResponse> = {
        success: true,
        data: {
            token,
            user: compteRowToApi(row),
        },
    };

    ctx.response.body = response;
});

// ============================================================
// GET /auth/validate
// ============================================================
/**
 * Valide le token JWT et retourne les infos de l'utilisateur connecté.
 * Utilisé par le frontend pour vérifier la session au démarrage.
 */
router.get("/validate", authMiddleware, (ctx: AuthContext) => {
    const cptId = ctx.state.user!.cpt_id;

    const row = db.prepare(`
        SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
        FROM t_compte_cpt
        WHERE cpt_id = ?;
    `).get(cptId);

    if (!row || !isCompteRow(row)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Utilisateur introuvable.",
        );
    }

    const response: APIResponse<{ valid: true; user: User }> = {
        success: true,
        data: {
            valid: true,
            user: compteRowToApi(row),
        },
    };

    ctx.response.body = response;
});

export default router;