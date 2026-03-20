import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Associer — vérification JWT puis proxy vers /api/associer.
 *
 * GET    /associer                                → toutes les associations
 * GET    /associer/carte/:carId                   → étiquettes d'une carte
 * GET    /associer/etiquette/:etiId               → cartes d'une étiquette
 * POST   /associer                                → créer une association
 * DELETE /associer/carte/:carId/etiquette/:etiId  → supprimer une association
 */
const routeAssocier = new Router({ prefix: "/api/associer" });

routeAssocier
    .get("/",                                       authMiddleware, proxyToTomcat)
    .get("/carte/:carId",                           authMiddleware, proxyToTomcat)
    .get("/etiquette/:etiId",                       authMiddleware, proxyToTomcat)
    .post("/",                                      authMiddleware, proxyToTomcat)
    .delete("/carte/:carId/etiquette/:etiId",       authMiddleware, proxyToTomcat);

export default routeAssocier;