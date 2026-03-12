import { Router } from "@oak/oak";
import { db } from "../main.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { APIErreurCode, APIException, APIResponse } from "../model/reponse.ts";
import { type AuthContext } from "../model/auth.ts";
import { type Notification } from "../model/notification.ts";
import { isNotificationRow, notificationRowToApi, isCompteRow } from "../model/db.ts";

export const routeNotif = new Router({ prefix: "/notifications" });

function isAdmin(ctx: AuthContext): boolean {
    return ctx.state.user?.role === "A";
}

function ensureNotificationAccess(ctx: AuthContext, ownerId: string | null) {
    if (isAdmin(ctx)) return;
    if (!ownerId || ownerId !== ctx.state.user?.cpt_id) {
        throw new APIException(
            APIErreurCode.ROLE_UNAUTHORIZED,
            403,
            "Acces refuse",
        );
    }
}

function resolveCptIdFromPseudo(pseudo: string): string | null {
    const row = db.prepare(`
      SELECT cpt_id, cpt_pseudo, cpt_mdp, cpt_role
      FROM t_compte_cpt
      WHERE cpt_pseudo = ?;
    `).get(pseudo);
    return row && isCompteRow(row) ? row.cpt_id : null;
}

/**
 * GET /notifications
 */
routeNotif.get("/", authMiddleware, (ctx: AuthContext) => {
    const rows = isAdmin(ctx)
        ? db.prepare(`
        SELECT not_id, not_titre, not_date, not_lien, cpt_id
        FROM t_notification_not
        ORDER BY not_date DESC;
      `).all()
        : db.prepare(`
        SELECT not_id, not_titre, not_date, not_lien, cpt_id
        FROM t_notification_not
        WHERE cpt_id = ?
        ORDER BY not_date DESC;
      `).all(ctx.state.user!.cpt_id);

    const notifications: Notification[] = rows
        .filter(isNotificationRow)
        .map(notificationRowToApi);

    const response: APIResponse<Notification[]> = {
        success: true,
        data: notifications,
    };

    ctx.response.body = response;
});

/**
 * GET /notifications/:id
 */
routeNotif.get("/:id", authMiddleware, (ctx: AuthContext) => {
    const id = ctx.params.id!;
    const row = db.prepare(`
      SELECT not_id, not_titre, not_date, not_lien, cpt_id
      FROM t_notification_not
      WHERE not_id = ?;
    `).get(id);

    if (!row || !isNotificationRow(row)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Notification introuvable",
        );
    }

    ensureNotificationAccess(ctx, row.cpt_id);

    const response: APIResponse<Notification> = {
        success: true,
        data: notificationRowToApi(row),
    };

    ctx.response.body = response;
});

/**
 * POST /notifications
 */
routeNotif.post("/", authMiddleware, async (ctx: AuthContext) => {
    const body = await ctx.request.body.json();

    let targetId: string | null = body?.cpt_id ?? null;
    if (!targetId && body?.pseudo) {
        targetId = resolveCptIdFromPseudo(body.pseudo);
        if (!targetId) {
            throw new APIException(
                APIErreurCode.NOT_FOUND,
                404,
                "Utilisateur introuvable",
            );
        }
    }

    if (!isAdmin(ctx)) {
        targetId = ctx.state.user!.cpt_id;
    }

    if (!isAdmin(ctx) && targetId !== ctx.state.user!.cpt_id) {
        throw new APIException(
            APIErreurCode.ROLE_UNAUTHORIZED,
            403,
            "Acces refuse",
        );
    }

    const id = crypto.randomUUID();
    const date = body?.date ?? body?.not_date ?? new Date().toISOString();

    db.prepare(`
      INSERT INTO t_notification_not (not_id, not_titre, not_date, not_lien, cpt_id)
      VALUES (?, ?, ?, ?, ?);
    `).run(
        id,
        body?.titre ?? body?.not_titre ?? null,
        date,
        body?.lien ?? body?.not_lien ?? null,
        targetId,
    );

    const response: APIResponse<{ id: string }> = {
        success: true,
        data: { id },
    };

    ctx.response.status = 201;
    ctx.response.body = response;
});

/**
 * PUT /notifications/:id
 */
routeNotif.put("/:id", authMiddleware, async (ctx: AuthContext) => {
    const id = ctx.params.id!;
    const body = await ctx.request.body.json();

    const existing = db.prepare(`
      SELECT not_id, not_titre, not_date, not_lien, cpt_id
      FROM t_notification_not
      WHERE not_id = ?;
    `).get(id);

    if (!existing || !isNotificationRow(existing)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Notification introuvable",
        );
    }

    ensureNotificationAccess(ctx, existing.cpt_id);

    let targetId: string | null = existing.cpt_id;
    if (isAdmin(ctx)) {
        if (body?.cpt_id) {
            targetId = body.cpt_id;
        } else if (body?.pseudo) {
            const resolved = resolveCptIdFromPseudo(body.pseudo);
            if (!resolved) {
                throw new APIException(
                    APIErreurCode.NOT_FOUND,
                    404,
                    "Utilisateur introuvable",
                );
            }
            targetId = resolved;
        }
    }

    if (!body || (
        body.titre === undefined &&
        body.not_titre === undefined &&
        body.lien === undefined &&
        body.not_lien === undefined &&
        body.date === undefined &&
        body.not_date === undefined &&
        body.cpt_id === undefined &&
        body.pseudo === undefined
    )) {
        throw new APIException(
            APIErreurCode.BAD_REQUEST,
            400,
            "Aucune donnee a mettre a jour",
        );
    }

    db.prepare(`
      UPDATE t_notification_not
      SET
        not_titre = COALESCE(?, not_titre),
        not_date = COALESCE(?, not_date),
        not_lien = COALESCE(?, not_lien),
        cpt_id = COALESCE(?, cpt_id)
      WHERE not_id = ?;
    `).run(
        body?.titre ?? body?.not_titre ?? null,
        body?.date ?? body?.not_date ?? null,
        body?.lien ?? body?.not_lien ?? null,
        targetId,
        id,
    );

    const response: APIResponse<null> = {
        success: true,
        data: null,
    };

    ctx.response.body = response;
});

/**
 * DELETE /notifications/:id
 */
routeNotif.delete("/:id", authMiddleware, (ctx: AuthContext) => {
    const id = ctx.params.id!;

    const existing = db.prepare(`
      SELECT not_id, not_titre, not_date, not_lien, cpt_id
      FROM t_notification_not
      WHERE not_id = ?;
    `).get(id);

    if (!existing || !isNotificationRow(existing)) {
        throw new APIException(
            APIErreurCode.NOT_FOUND,
            404,
            "Notification introuvable",
        );
    }

    ensureNotificationAccess(ctx, existing.cpt_id);

    db.prepare(`
      DELETE FROM t_notification_not
      WHERE not_id = ?;
    `).run(id);

    const response: APIResponse<null> = {
        success: true,
        data: null,
    };

    ctx.response.body = response;
});

export default routeNotif;
