import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Notification — vérification JWT puis proxy vers /api/notification.
 *
 * Note : ces routes remplacent à terme les routes SQLite directes de notif.ts.
 * Le préfixe est /notification (singulier) pour correspondre à l'API Tomcat.
 *
 * GET    /notification                        → toutes (admin) ou les siennes
 * GET    /notification/:notId                 → une notification
 * POST   /notification                        → créer une notification
 * PUT    /notification/:notId                 → modifier une notification
 * PATCH  /notification/:notId/read            → marquer comme lue
 * DELETE /notification/:notId                 → supprimer
 */
const routeNotification = new Router({ prefix: "/api/notification" });

routeNotification
    .get("/",                       authMiddleware, proxyToTomcat)
    .get("/:notId",                 authMiddleware, proxyToTomcat)
    .post("/",                      authMiddleware, proxyToTomcat)
    .put("/:notId",                 authMiddleware, proxyToTomcat)
    .patch("/:notId/read",          authMiddleware, proxyToTomcat)
    .delete("/:notId",              authMiddleware, proxyToTomcat);

export default routeNotification;