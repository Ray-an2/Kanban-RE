import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Étiquette — vérification JWT puis proxy vers /api/etiquette.
 *
 * GET    /etiquette                    → toutes les étiquettes
 * GET    /etiquette/:id                → une étiquette
 * GET    /etiquette/nom/:nom           → étiquettes par nom
 * GET    /etiquette/couleur/:couleur   → étiquettes par couleur
 * POST   /etiquette                    → créer une étiquette
 * PUT    /etiquette/:id                → modifier une étiquette
 * DELETE /etiquette/:id                → supprimer une étiquette
 */
const routeEtiquette = new Router({ prefix: "/etiquette" });

routeEtiquette
    .get("/",                       authMiddleware, proxyToTomcat)
    .get("/nom/:nom",               authMiddleware, proxyToTomcat)
    .get("/couleur/:couleur",       authMiddleware, proxyToTomcat)
    .get("/:id",                    authMiddleware, proxyToTomcat)
    .post("/",                      authMiddleware, proxyToTomcat)
    .put("/:id",                    authMiddleware, proxyToTomcat)
    .delete("/:id",                 authMiddleware, proxyToTomcat);

export default routeEtiquette;