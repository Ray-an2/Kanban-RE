import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { DatabaseSync } from "node:sqlite";

import routeUser from "./routes/user.ts";
import routeNotif from "./routes/notif.ts";
import routeAuth from "./routes/auth.ts";
import routeTab from "./routes/tableau.ts";
import routeCarte from "./routes/carte.ts";
import routeListe from "./routes/liste.ts";
import routeAdmin from "./routes/admin.ts";
import routeMem from "./routes/membre.ts"; // voir plus tard
// import routeEti from "./routes/etiquette.ts";
// import routeCom from "./routes/commentaire.ts";
// import routeDoc from "./routes/document.ts";
import {errorMiddleware} from "./middleware/error.ts";

// --- Database ----
export const db = new DatabaseSync("./kanban.db");

// --- WebSocket Management ---
const clients = new Set<WebSocket>();

// --- Application ---

const PROTOCOL = Deno.env.get("PROTOCOL") ?? "http";
const HOST = Deno.env.get("HOST") ?? "0.0.0.0";
const PORT = Number(Deno.env.get("PORT") ?? "8000");
const ADDRESS = `${PROTOCOL}://${HOST}:${PORT}`;

const app = new Application();

// --- Middleware ---
app.use(oakCors());
app.use(errorMiddleware);

// --- Routes ---
app.use(routeUser.routes(), routeUser.allowedMethods());
app.use(routeAuth.routes(), routeAuth.allowedMethods());
app.use(routeNotif.routes(), routeNotif.allowedMethods());
app.use(routeTab.routes(), routeTab.allowedMethods());
app.use(routeListe.routes(), routeListe.allowedMethods());
app.use(routeCarte.routes(), routeCarte.allowedMethods());
app.use(routeAdmin.routes(), routeAdmin.allowedMethods());
app.use(routeMem.routes(), routeMem.allowedMethods());
// app.use(routeEti.routes(), routeEti.allowedMethods());
// app.use(routeCom.routes(), routeCom.allowedMethods());
// app.use(routeDoc.routes(), routeDoc.allowedMethods());

// --- Lancement ---

app.addEventListener(
    "listen",
    () => console.log(`Server listening on ${ADDRESS}`),
);

if (import.meta.main) {
    await app.listen({ hostname: HOST, port: PORT });
}

export { app };
