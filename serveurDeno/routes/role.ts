import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import { proxyToTomcat } from "../middleware/proxy.ts";

const routeRole = new Router({ prefix: "/api/role" });

routeRole
    .get("/",                                       authMiddleware, proxyToTomcat)
    .get("/compte/:cptId",                          authMiddleware, proxyToTomcat)
    .get("/tableau/:tabId",                         authMiddleware, proxyToTomcat)
    .post("/",                                      authMiddleware, proxyToTomcat)
    .patch("/tableau/:tabId/compte/:cptId",         authMiddleware, proxyToTomcat)
    .patch("/tableau/:tabId/invitation/accepter",   authMiddleware, proxyToTomcat)
    .delete("/tableau/:tabId/invitation/refuser",   authMiddleware, proxyToTomcat)
    .delete("/tableau/:tabId/compte/:cptId",        authMiddleware, proxyToTomcat);

export default routeRole;