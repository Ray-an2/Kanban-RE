import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Liste — vérification JWT puis proxy vers /api/liste.
 *
 * GET    /liste/tableau/:tabId                → listes publiées d'un tableau
 * GET    /liste/tableau/:tabId/archivees      → listes archivées
 * GET    /liste/:id                           → une liste
 * POST   /liste                               → créer une liste
 * PUT    /liste/:id                           → modifier le titre
 * DELETE /liste/:id                           → supprimer une liste
 * PATCH  /liste/:id/archiver                  → archiver
 * PATCH  /liste/:id/desarchiver               → désarchiver
 * PUT    /liste/tableau/:tabId/ordre          → réorganiser les listes
 * PUT    /liste/:lisId/ordre-cartes           → réorganiser les cartes
 */
const routeListe = new Router({ prefix: "/api/liste" });

routeListe
    .get("/tableau/:tabId",                 authMiddleware, proxyToTomcat)
    .get("/tableau/:tabId/archivees",       authMiddleware, proxyToTomcat)
    .get("/:id",                            authMiddleware, proxyToTomcat)
    .post("/",                              authMiddleware, proxyToTomcat)
    .put("/:id",                            authMiddleware, proxyToTomcat)
    .delete("/:id",                         authMiddleware, proxyToTomcat)
    .patch("/:id/archiver",                 authMiddleware, proxyToTomcat)
    .patch("/:id/desarchiver",              authMiddleware, proxyToTomcat)
    .put("/tableau/:tabId/ordre",           authMiddleware, proxyToTomcat)
    .put("/:lisId/ordre-cartes",            authMiddleware, proxyToTomcat);

export default routeListe;