import { Router } from "@oak/oak";
import { db } from "../main.ts";

import { isCompteRow, compteRowToApi } from "../model/db.ts";
import { APIErreurCode, APIException, APIResponse } from "../model/reponse.ts";
import { type AuthResponse, type LoginRequest, type RegisterRequest, type AuthContext } from "../model/auth.ts";
import { type User } from "../model/user.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { createJWT, hashPassword, verifyPassword } from "../middleware/jwt.ts";

const router = new Router({ prefix: "/users" });

function requireAdmin(ctx: AuthContext) {
    if (!ctx.state.user || ctx.state.user.role !== "A") {
        throw new APIException(
            APIErreurCode.ROLE_UNAUTHORIZED,
            403,
            "Acces administrateur requis",
        );
    }
}

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
    INSERT INTO t_profil_pfl (pfl_nom, pfl_prenom, pfl_date, pfl_mail, cpt_id)
    VALUES (?, ?, ?, ?, ?);
    `).run(
        body.nom,
        body.prenom,
        createdAt,
        body.email,
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
 * GET /users/validate
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

/**
 * GET /users/me
 */
router.get("/me", authMiddleware, (ctx: AuthContext) => {
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

    const response: APIResponse<User> = {
        success: true,
        data: compteRowToApi(row),
    };

    ctx.response.body = response;
});

/**
 * PUT /users/me/profile
 * Modifier son profil
 */
router.put("/me/profile", authMiddleware, async (ctx: AuthContext) => {
    const cptId = ctx.state.user!.cpt_id;
    const body = await ctx.request.body.json();

    if (!body || (body.nom === undefined && body.prenom === undefined && body.email === undefined)) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Aucune donnee a mettre a jour",
        );
    }

    const result = db.prepare(`
    UPDATE t_profil_pfl
    SET
      pfl_nom = COALESCE(?, pfl_nom),
      pfl_prenom = COALESCE(?, pfl_prenom),
      pfl_mail = COALESCE(?, pfl_mail)
    WHERE cpt_id = ?;
  `).run(
        body.nom ?? null,
        body.prenom ?? null,
        body.email ?? null,
        cptId,
    );

    if (result.changes === 0) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Profil introuvable",
        );
    }

    const response: APIResponse<null> = {
        success: true,
        data: null,
    };

    ctx.response.body = response;
});

/**
 * PUT /users/me/password
 * Modifier son mot de passe
 */
router.put("/me/password", authMiddleware, async (ctx: AuthContext) => {
    const cptId = ctx.state.user!.cpt_id;
    const body = await ctx.request.body.json();

    if (!body?.ancienMotDePasse || !body?.nouveauMotDePasse) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Champs manquants",
        );
    }

    const row = db.prepare(`
    SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_id = ?;
  `).get(cptId);

    if (!row || !isCompteRow(row)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Utilisateur introuvable",
        );
    }

    const ok = await verifyPassword(body.ancienMotDePasse, row.cpt_mdp);
    if (!ok) {
        throw new APIException(
            APIErreurCode.UNAUTHORIZED,
            401,
            "Mot de passe invalide",
        );
    }

    const newHash = await hashPassword(body.nouveauMotDePasse);

    db.prepare(`
    UPDATE t_compte_cpt
    SET cpt_mdp = ?
    WHERE cpt_id = ?;
  `).run(newHash, cptId);

    const response: APIResponse<null> = {
        success: true,
        data: null,
    };

    ctx.response.body = response;
});

/**
 * PUT /users/me/pseudo
 * Modifier son pseudo
 */
router.put("/me/pseudo", authMiddleware, async (ctx: AuthContext) => {
    const cptId = ctx.state.user!.cpt_id;
    const body = await ctx.request.body.json();

    if (!body?.nouveauPseudo || !body?.motDePasse) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Champs manquants",
        );
    }

    const existing = db.prepare(`
    SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_id = ?;
  `).get(cptId);

    if (!existing || !isCompteRow(existing)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Utilisateur introuvable",
        );
    }

    const ok = await verifyPassword(body.motDePasse, existing.cpt_mdp);
    if (!ok) {
        throw new APIException(
            APIErreurCode.UNAUTHORIZED,
            401,
            "Mot de passe invalide",
        );
    }

    const duplicate = db.prepare(`
    SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_pseudo = ?;
  `).get(body.nouveauPseudo);

    if (duplicate && isCompteRow(duplicate)) {
        throw new APIException(
            APIErreurCode.VALIDATION_ERROR,
            409,
            "Pseudo deja utilise",
        );
    }

    db.prepare(`
    UPDATE t_compte_cpt
    SET cpt_pseudo = ?
    WHERE cpt_id = ?;
  `).run(body.nouveauPseudo, cptId);

    const token = await createJWT({
        cpt_id: existing.cpt_id,
        cpt_pseudo: body.nouveauPseudo,
        role: existing.cpt_role,
    });

    const response: APIResponse<{ pseudo: string; token: string }> = {
        success: true,
        data: { pseudo: body.nouveauPseudo, token },
    };

    ctx.response.body = response;
});

/**
 * GET /users
 * Lister tous les utilisateurs
 */
router.get("/", authMiddleware, (ctx: AuthContext) => {
    requireAdmin(ctx);
    const rows = db.prepare(`
    SELECT
      cpt_id,
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
router.get("/:id", authMiddleware, (ctx: AuthContext) => {
    requireAdmin(ctx);
    const cptId = ctx.params.id!;

    const row = db.prepare(`
    SELECT
      cpt_id,
      cpt_pseudo,
      cpt_mdp,
      cpt_role
    FROM t_compte_cpt
    WHERE cpt_id = ?;
  `).get(cptId);

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
router.post("/", authMiddleware, async (ctx: AuthContext) => {
    requireAdmin(ctx);
    const body = (await ctx.request.body.json()) as RegisterRequest & { role?: string };

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
  INSERT INTO t_compte_cpt (
    cpt_id, cpt_pseudo, cpt_mdp, cpt_role
  ) VALUES (?, ?, ?, ?);
`).run(cptId, body.pseudo, passwordHash, body.role ?? "U");

    db.prepare(`
  INSERT INTO t_profil_pfl (
    pfl_nom, pfl_prenom, pfl_date, pfl_mail, cpt_id
  ) VALUES (?, ?, ?, ?, ?);
`).run(
        body.nom,
        body.prenom,
        createdAt,
        body.email,
        cptId,
    );

    const response: APIResponse<{ id: string }> = {
        success: true,
        data: { id: cptId },
    };

    ctx.response.status = 201;
    ctx.response.body = response;
});

/**
 * PUT /users/:id
 */
router.put("/:id", authMiddleware, async (ctx: AuthContext) => {
    requireAdmin(ctx);
    const cptId = ctx.params.id!;

    const body = await ctx.request.body.json();

    const existing = db.prepare(`
    SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
    FROM t_compte_cpt WHERE cpt_id = ?;
  `).get(cptId);

    if (!existing || !isCompteRow(existing)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Utilisateur introuvable"
        );
    }

    if (body?.pseudo && body.pseudo !== existing.cpt_pseudo) {
        const duplicate = db.prepare(`
      SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
      FROM t_compte_cpt WHERE cpt_pseudo = ?;
    `).get(body.pseudo);

        if (duplicate && isCompteRow(duplicate)) {
            throw new APIException(
                APIErreurCode.VALIDATION_ERROR,
                409,
                "Pseudo deja utilise",
            );
        }
    }

    db.prepare(`
    UPDATE t_compte_cpt
    SET
      cpt_pseudo = COALESCE(?, cpt_pseudo),
      cpt_mdp = COALESCE(?, cpt_mdp),
      cpt_role = COALESCE(?, cpt_role)
    WHERE cpt_id = ?;
  `).run(
        body.pseudo ?? null,
        body.motDePasse ? await hashPassword(body.motDePasse) : null,
        body.role ?? null,
        cptId,
    );

    db.prepare(`
    UPDATE t_profil_pfl
    SET
      pfl_nom = COALESCE(?, pfl_nom),
      pfl_prenom = COALESCE(?, pfl_prenom),
      pfl_mail = COALESCE(?, pfl_mail)
    WHERE cpt_id = ?;
  `).run(
        body.nom ?? null,
        body.prenom ?? null,
        body.email ?? null,
        cptId,
    );

    const response: APIResponse<null> = {
        success: true,
        data: null,
    };

    ctx.response.body = response;
});

/**
 * DELETE /users/:id
 */
router.delete("/:id", authMiddleware, (ctx: AuthContext) => {
    requireAdmin(ctx);
    const cptId = ctx.params.id!;

    db.prepare(`
    UPDATE t_notification_not
    SET cpt_id = NULL
    WHERE cpt_id = ?;
  `).run(cptId);

    const result = db.prepare(`
    DELETE FROM t_compte_cpt
    WHERE cpt_id = ?;
  `).run(cptId);

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
