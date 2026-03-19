import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

/**
 * Routes Profil — vérification JWT puis proxy vers /api/profil.
 *
 * GET    /profil/:id      → récupérer un profil (par cpt_id)
 * POST   /profil          → créer un profil (appelé par inscription)
 * PUT    /profil/:id      → modifier un profil
 * DELETE /profil/:id      → supprimer un profil
 */
const routeProfil = new Router({ prefix: "/profil" });

routeProfil
    .get("/:id",        authMiddleware, proxyToTomcat)
    .post("/",          proxyToTomcat)  // pas de JWT : appelé par inscription
    .put("/:id",        authMiddleware, proxyToTomcat)
    .delete("/:id",     authMiddleware, proxyToTomcat);

export default routeProfil;