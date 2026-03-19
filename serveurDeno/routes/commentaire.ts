import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Commentaire — vérification JWT puis proxy vers /api/commentaire.
 * Les commentaires sont stockés dans MongoDB côté Tomcat.
 *
 * GET    /commentaire                  → tous les commentaires
 * GET    /commentaire/:comId           → un commentaire
 * GET    /commentaire?carteId=...      → commentaires d'une carte (query param)
 * POST   /commentaire                  → créer un commentaire
 * DELETE /commentaire/:comId           → supprimer un commentaire
 */
const routeCommentaire = new Router({ prefix: "/api/commentaire" });

routeCommentaire
    .get("/",               authMiddleware, proxyToTomcat)
    .get("/:comId",         authMiddleware, proxyToTomcat)
    .post("/",              authMiddleware, proxyToTomcat)
    .delete("/:comId",      authMiddleware, proxyToTomcat);

export default routeCommentaire;