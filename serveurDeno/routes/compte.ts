import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Compte — vérification JWT puis proxy vers /api/compte.
 *
 * Note : POST /compte (création) ne nécessite PAS de JWT car c'est
 * l'inscription. L'inscription est gérée directement par auth.ts
 * (route /auth/inscription) côté Deno — Tomcat reçoit le compte
 * déjà validé avec le mdp haché.
 *
 * GET    /compte                               → tous les comptes (admin)
 * GET    /compte/pseudo/:pseudo/disponible     → pseudo disponible ?
 * GET    /compte/:id                           → un compte
 * POST   /compte                               → créer (appelé par auth/inscription)
 * PATCH  /compte/:id/pseudo                    → modifier le pseudo
 * PATCH  /compte/:id/role                      → modifier le rôle (admin)
 * PATCH  /compte/:id/mdp                       → modifier le mot de passe
 * DELETE /compte/:id                           → supprimer un compte
 */
const routeCompte = new Router({ prefix: "/api/compte" });

routeCompte
    .get("/",                               authMiddleware, proxyToTomcat)
    .get("/pseudo/:pseudo/disponible",      authMiddleware, proxyToTomcat)
    .get("/:id",                            authMiddleware, proxyToTomcat)
    .post("/",                              proxyToTomcat) // pas de JWT : appelé par inscription
    .patch("/:id/pseudo",                   authMiddleware, proxyToTomcat)
    .patch("/:id/role",                     authMiddleware, proxyToTomcat)
    .patch("/:id/mdp",                      authMiddleware, proxyToTomcat)
    .delete("/:id",                         authMiddleware, proxyToTomcat);

export default routeCompte;