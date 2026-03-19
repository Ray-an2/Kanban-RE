import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Rôle — vérification JWT puis proxy vers /api/role.
 *
 * GET    /role                                    → tous les rôles
 * GET    /role/compte/:cptId                      → rôles d'un compte
 * GET    /role/tableau/:tabId                     → membres d'un tableau
 * POST   /role                                    → associer un rôle
 * PATCH  /role/tableau/:tabId/compte/:cptId       → modifier un rôle
 * DELETE /role/tableau/:tabId/compte/:cptId       → retirer un membre
 */
const routeRole = new Router({ prefix: "/api/role" });

routeRole
    .get("/",                                   authMiddleware, proxyToTomcat)
    .get("/compte/:cptId",                      authMiddleware, proxyToTomcat)
    .get("/tableau/:tabId",                     authMiddleware, proxyToTomcat)
    .post("/",                                  authMiddleware, proxyToTomcat)
    .patch("/tableau/:tabId/compte/:cptId",     authMiddleware, proxyToTomcat)
    .delete("/tableau/:tabId/compte/:cptId",    authMiddleware, proxyToTomcat);

export default routeRole;