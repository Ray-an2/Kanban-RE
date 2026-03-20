import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

const routeCompte = new Router({ prefix: "/api/compte" });

routeCompte
    .get("/",                               authMiddleware, proxyToTomcat)
    .get("/pseudo/:pseudo",                 authMiddleware, proxyToTomcat)
    .get("/pseudo/:pseudo/disponible",      proxyToTomcat)
    .get("/:id",                            authMiddleware, proxyToTomcat)
    .post("/",                              proxyToTomcat)
    .patch("/:id/pseudo",                   authMiddleware, proxyToTomcat)
    .patch("/:id/role",                     authMiddleware, proxyToTomcat)
    .patch("/:id/mdp",                      authMiddleware, proxyToTomcat)
    .delete("/:id",                         authMiddleware, proxyToTomcat);

export default routeCompte;