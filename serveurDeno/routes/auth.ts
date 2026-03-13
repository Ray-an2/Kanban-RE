import { Router } from "@oak/oak";
import { db } from "../main.ts";

import { isCompteRow, compteRowToApi } from "../model/db.ts";
import { APIErreurCode, APIException, APIResponse } from "../model/reponse.ts";
import { type AuthResponse, type LoginRequest, type RegisterRequest, type AuthContext } from "../model/auth.ts";
import { type User } from "../model/user.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { createJWT, hashPassword, verifyPassword } from "../middleware/jwt.ts";

const router = new Router({ prefix: "/auth" });

/**
 * POST /auth/inscription
 */
router.post("/inscription", async (ctx) => {
    const body = (await ctx.request.body.json()) as RegisterRequest;

    if (!body?.pseudo || !body?.motDePasse || !body?.email || !body?.nom || !body?.prenom) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Champs manquants",
        );
    }

    const existing = db.prepare(`
    SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_pseudo = ?;`).get(body.pseudo);

    if (existing && isCompteRow(existing)) {
        throw new APIException(
            APIErreurCode.VALIDATION_ERROR,
            409,
            "Pseudo deja utilise",
        );
    }

    const cptId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const passwordHash = await hashPassword(body.motDePasse);

    db.prepare(`
    INSERT INTO t_compte_cpt (cpt_id, cpt_pseudo, cpt_mdp, cpt_role)
    VALUES (?, ?, ?, ?);
    `).run(cptId, body.pseudo, passwordHash, "U");

    db.prepare(`
    INSERT INTO t_profil_pfl (pfl_nom, pfl_prenom, pfl_date, pfl_mail, pfl_etat, cpt_id)
    VALUES (?, ?, ?, ?, ?, ?);
    `).run(
        body.nom,
        body.prenom,
        createdAt,
        body.email,
        "D",
        cptId,
    );

    const user: User = {
        cpt_id: cptId,
        cpt_pseudo: body.pseudo,
        cpt_role: "U",
    };

    const response: APIResponse<User> = {
        success: true,
        data: user,
    };

    ctx.response.status = 201;
    ctx.response.body = response;
});

/**
 * POST /auth/login
 */
router.post("/login", async (ctx) => {
    const body = (await ctx.request.body.json()) as LoginRequest;

    if (!body?.pseudo || !body?.motDePasse) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Champs manquants",
        );
    }

    const row = db.prepare(`
    SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_pseudo = ?;
    `).get(body.pseudo);

    if (!row || !isCompteRow(row)) {
        throw new APIException(
            APIErreurCode.UNAUTHORIZED,
            401,
            "Identifiants invalides",
        );
    }

    const ok = await verifyPassword(body.motDePasse, row.cpt_mdp);
    if (!ok) {
        throw new APIException(
            APIErreurCode.UNAUTHORIZED,
            401,
            "Mot de passe invalides",
        );
    }

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

/**
 * GET /auth/validate
 */
router.get("/validate", authMiddleware, (ctx: AuthContext) => {
    const cptId = ctx.state.user!.cpt_id;
    const row = db.prepare(`
    SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_id = ?;`).get(cptId);

    if (!row || !isCompteRow(row)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Utilisateur introuvable",
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
