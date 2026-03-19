import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Membre — vérification JWT puis proxy vers /api/membre.
 *
 * GET    /membre                              → tous les membres
 * GET    /membre/carte/:carId                 → membres d'une carte
 * POST   /membre                              → associer un membre à une carte
 * DELETE /membre/carte/:carId/compte/:cptId   → retirer un membre d'une carte
 */
const routeMembre = new Router({ prefix: "/api/membre" });

routeMembre
    .get("/",                                   authMiddleware, proxyToTomcat)
    .get("/carte/:carId",                       authMiddleware, proxyToTomcat)
    .post("/",                                  authMiddleware, proxyToTomcat)
    .delete("/carte/:carId/compte/:cptId",      authMiddleware, proxyToTomcat);

export default routeMembre;