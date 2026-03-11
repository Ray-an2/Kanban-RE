import { Router } from "@oak/oak";
import { db } from "../main.ts";

import { isCompteRow, compteRowToApi } from "../model/db.ts";
import { APIErreurCode, APIException, APIResponse } from "../model/reponse.ts";
import { type AuthResponse, type LoginRequest, type RegisterRequest, type AuthContext } from "../model/auth.ts";
import { type User } from "../model/user.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { createJWT, hashPassword, verifyPassword } from "../middleware/jwt.ts";

const router = new Router({ prefix: "/users" });

/**
 * POST /users/register
 */
router.post("/register", async (ctx) => {
    const body = (await ctx.request.body.json()) as RegisterRequest;

    if (!body?.pseudo || !body?.motDePasse || !body?.email || !body?.nom || !body?.prenom) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Champs manquants",
        );
    }

    const existing = db.prepare(`
    SELECT cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_pseudo = ?;`).get(body.pseudo);

    if (existing && isCompteRow(existing)) {
        throw new APIException(
            APIErreurCode.VALIDATION_ERROR,
            409,
            "Pseudo deja utilise",
        );
    }

    const createdAt = new Date().toISOString();
    const passwordHash = await hashPassword(body.motDePasse);

    db.prepare(`
    INSERT INTO t_compte_cpt (cpt_pseudo, cpt_mdp, cpt_role)
    VALUES (?, ?, ?);
    `).run(body.pseudo, passwordHash, "U");

    db.prepare(`
    INSERT INTO t_profil_pfl (pfl_nom, pfl_prenom, pfl_dateCreation, pfl_mail, cpt_pseudo)
    VALUES (?, ?, ?, ?, ?);
    `).run(
        body.nom,
        body.prenom,
        createdAt,
        body.email,
        body.pseudo,
    );

    const user: User = {
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
 * POST /users/login
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
    SELECT cpt_pseudo, cpt_mdp, cpt_role
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
        pseudo: row.cpt_pseudo,
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
 * GET /users/validate
 */
router.get("/validate", authMiddleware, (ctx: AuthContext) => {
    const pseudo = ctx.state.user!.pseudo;
    const row = db.prepare(`
    SELECT cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_pseudo = ?;`).get(pseudo);

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

/**
 * GET /users/me
 */
router.get("/me", authMiddleware, (ctx: AuthContext) => {
    const pseudo = ctx.state.user!.pseudo;

    const row = db.prepare(`
    SELECT cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_pseudo = ?;`).get(pseudo);

    if (!row || !isCompteRow(row)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Utilisateur introuvable",
        );
    }

    const response: APIResponse<User> = {
        success: true,
        data: compteRowToApi(row),
    };

    ctx.response.body = response;
});

/**
 * GET /users
 * Lister tous les utilisateurs
 */
router.get("/", (ctx) => {
    const rows = db.prepare(`
    SELECT
      cpt_pseudo,
      cpt_mdp,
      cpt_role
    FROM t_compte_cpt;
  `).all();

    const users: User[] = rows
        .filter(isCompteRow)
        .map(compteRowToApi);

    const response: APIResponse<User[]> = {
        success: true,
        data: users,
    };

    ctx.response.body = response;
});

/**
 * GET /users/:id
 */
router.get("/:id", (ctx) => {
    const pseudo = ctx.params.id!;

    const row = db.prepare(`
    SELECT
      cpt_pseudo,
      cpt_mdp,
      cpt_role
    FROM t_compte_cpt
    WHERE cpt_pseudo = ?;
  `).get(pseudo);

    if (!row || !isCompteRow(row)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Utilisateur introuvable"
        );
    }

    const response: APIResponse<User> = {
        success: true,
        data: compteRowToApi(row),
    };

    ctx.response.body = response;
});

/**
 * POST /users
 */
router.post("/", async (ctx) => {
    const body = (await ctx.request.body.json()) as RegisterRequest;

    if (!body?.pseudo || !body?.motDePasse || !body?.email || !body?.nom || !body?.prenom) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Champs manquants",
        );
    }

    const createdAt = new Date().toISOString();
    const passwordHash = await hashPassword(body.motDePasse);

    db.prepare(`
  INSERT INTO t_compte_cpt (
    cpt_pseudo, cpt_mdp, cpt_role
  ) VALUES (?, ?, ?);
`).run(body.pseudo, passwordHash, "U");

    db.prepare(`
  INSERT INTO t_profil_pfl (
    pfl_nom, pfl_prenom, pfl_dateCreation, pfl_mail, cpt_pseudo
  ) VALUES (?, ?, ?, ?, ?);
`).run(
        body.nom,
        body.prenom,
        createdAt,
        body.email,
        body.pseudo,
    );

    const response: APIResponse<{ pseudo: string }> = {
        success: true,
        data: { pseudo: body.pseudo },
    };

    ctx.response.status = 201;
    ctx.response.body = response;
});

/**
 * PUT /users/:id
 */
router.put("/:id", async (ctx) => {
    const pseudo = ctx.params.id!;

    const body = await ctx.request.body.json();

    const compteResult = db.prepare(`
    UPDATE t_compte_cpt
    SET
      cpt_mdp = COALESCE(?, cpt_mdp),
      cpt_role = COALESCE(?, cpt_role)
    WHERE cpt_pseudo = ?;
  `).run(
        body.motDePasse ? await hashPassword(body.motDePasse) : null,
        body.role ?? null,
        pseudo,
    );

    db.prepare(`
    UPDATE t_profil_pfl
    SET
      pfl_nom = COALESCE(?, pfl_nom),
      pfl_prenom = COALESCE(?, pfl_prenom),
      pfl_mail = COALESCE(?, pfl_mail)
    WHERE cpt_pseudo = ?;
  `).run(
        body.nom ?? null,
        body.prenom ?? null,
        body.email ?? null,
        pseudo,
    );

    if (compteResult.changes === 0) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Utilisateur introuvable"
        );
    }

    const response: APIResponse<null> = {
        success: true,
        data: null,
    };

    ctx.response.body = response;
});

/**
 * DELETE /users/:id
 */
router.delete("/:id", (ctx) => {
    const pseudo = ctx.params.id!;

    db.prepare(`
    DELETE FROM t_profil_pfl
    WHERE cpt_pseudo = ?;
  `).run(pseudo);

    const result = db.prepare(`
    DELETE FROM t_compte_cpt
    WHERE cpt_pseudo = ?;
  `).run(pseudo);

    if (result.changes === 0) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Utilisateur introuvable"
        );
    }

    ctx.response.body = {
        success: true,
        data: null,
    };
});

export default router;
