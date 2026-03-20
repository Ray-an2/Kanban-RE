import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";
import { type AuthContext } from "../model/auth.ts";

/**
 * Routes Tableau — toutes les requêtes sont vérifiées (JWT)
 * puis relayées vers le serveur Tomcat /api/tableau.
 *
 * GET    /tableau                        → tous les tableaux (admin)
 * GET    /tableau/nombre                 → nombre de tableaux
 * GET    /tableau/tri?tri=rec|alp        → tableaux triés
 * GET    /tableau/recherche?search=...   → recherche par nom
 * GET    /tableau/compte/:cptId          → tableaux d'un utilisateur
 * GET    /tableau/:id                    → un tableau
 * POST   /tableau                        → créer un tableau
 * PUT    /tableau/:id                    → modifier un tableau
 * DELETE /tableau/:id                    → supprimer un tableau
 * PATCH  /tableau/:id/fermer             → fermer un tableau
 * PATCH  /tableau/:id/ouvrir             → ouvrir un tableau
 */
const routeTableau = new Router({ prefix: "/api/tableau" });

routeTableau
    .get("/",                   authMiddleware, proxyToTomcat)
    .get("/nombre",             authMiddleware, proxyToTomcat)
    .get("/tri",                authMiddleware, proxyToTomcat)
    .get("/recherche",          authMiddleware, proxyToTomcat)
    .get("/compte/:cptId",      authMiddleware, proxyToTomcat)
    .get("/:id",                authMiddleware, proxyToTomcat)
    .post("/",                  authMiddleware, proxyToTomcat)
    .put("/:id",                authMiddleware, proxyToTomcat)
    .delete("/:id",             authMiddleware, proxyToTomcat)
    .patch("/:id/fermer",       authMiddleware, proxyToTomcat)
    .patch("/:id/ouvrir",       authMiddleware, proxyToTomcat);

export default routeTableau;