import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Document — vérification JWT puis proxy vers /api/document.
 * Les documents sont stockés dans MongoDB côté Tomcat.
 *
 * GET    /document                     → tous les documents (ou par carteId via ?carteId=)
 * GET    /document/:docId              → un document
 * POST   /document                     → créer un document
 * PUT    /document/:docId              → modifier un document
 * DELETE /document/:docId              → supprimer un document
 */
const routeDocument = new Router({ prefix: "/api/document" });

routeDocument
    .get("/",               authMiddleware, proxyToTomcat)
    .get("/:docId",         authMiddleware, proxyToTomcat)
    .post("/",              authMiddleware, proxyToTomcat)
    .put("/:docId",         authMiddleware, proxyToTomcat)
    .delete("/:docId",      authMiddleware, proxyToTomcat);

export default routeDocument;