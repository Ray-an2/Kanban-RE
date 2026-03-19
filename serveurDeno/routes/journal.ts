import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Journal — vérification JWT puis proxy vers /api/journal.
 *
 * POST   /journal                          → créer une entrée
 * GET    /journal/:id                      → une entrée par id
 * GET    /journal/tableau/:tabId           → journal d'un tableau
 * GET    /journal/tableau/:tabId/count     → nombre d'entrées d'un tableau
 * GET    /journal/tableau/:tabId/last      → dernière entrée d'un tableau
 * GET    /journal/carte/:carId             → journal d'une carte
 * GET    /journal/etat/:etat               → entrées par état
 */
const routeJournal = new Router({ prefix: "/journal" });

routeJournal
    .post("/",                          authMiddleware, proxyToTomcat)
    .get("/tableau/:tabId/count",       authMiddleware, proxyToTomcat)
    .get("/tableau/:tabId/last",        authMiddleware, proxyToTomcat)
    .get("/tableau/:tabId",             authMiddleware, proxyToTomcat)
    .get("/carte/:carId",               authMiddleware, proxyToTomcat)
    .get("/etat/:etat",                 authMiddleware, proxyToTomcat)
    .get("/:id",                        authMiddleware, proxyToTomcat);

export default routeJournal;