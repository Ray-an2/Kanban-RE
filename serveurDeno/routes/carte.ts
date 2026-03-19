import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Carte — vérification JWT puis proxy vers /api/carte.
 *
 * GET    /carte                              → toutes les cartes
 * GET    /carte/tableau/:tabId/archivees     → cartes archivées d'un tableau
 * GET    /carte/liste/:lisId/count           → nombre de cartes dans une liste
 * GET    /carte/:carId                       → une carte
 * GET    /carte/:carId/retard               → carte en retard ?
 * POST   /carte                              → créer une carte
 * PUT    /carte/:carId                       → modifier une carte
 * DELETE /carte/:carId                       → supprimer une carte
 * PATCH  /carte/:carId/archiver              → basculer archivage
 * PATCH  /carte/:carId/terminer              → basculer terminé
 * PATCH  /carte/:carId/move-liste            → déplacer vers une liste
 * PATCH  /carte/:carId/deplacer              → déplacer avec ordre (drag & drop simple)
 * PATCH  /carte/:carId/drag-drop             → drag & drop complet avec renumérotation
 */
const routeCarte = new Router({ prefix: "/carte" });

routeCarte
    .get("/",                               authMiddleware, proxyToTomcat)
    .get("/tableau/:tabId/archivees",       authMiddleware, proxyToTomcat)
    .get("/liste/:lisId/count",             authMiddleware, proxyToTomcat)
    .get("/:carId",                         authMiddleware, proxyToTomcat)
    .get("/:carId/retard",                  authMiddleware, proxyToTomcat)
    .post("/",                              authMiddleware, proxyToTomcat)
    .put("/:carId",                         authMiddleware, proxyToTomcat)
    .delete("/:carId",                      authMiddleware, proxyToTomcat)
    .patch("/:carId/archiver",              authMiddleware, proxyToTomcat)
    .patch("/:carId/terminer",              authMiddleware, proxyToTomcat)
    .patch("/:carId/move-liste",            authMiddleware, proxyToTomcat)
    .patch("/:carId/deplacer",              authMiddleware, proxyToTomcat)
    .patch("/:carId/drag-drop",             authMiddleware, proxyToTomcat);

export default routeCarte;