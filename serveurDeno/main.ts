import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { DatabaseSync } from "node:sqlite";

import { routeUser } from "./routes/user.ts";
import { routeTab } from "./routes/tab.ts";
import { routeListe } from "./routes/liste.ts";
import { routeCarte } from "./routes/carte.ts";
import { routeNotif } from "./routes/notif.ts";
import { routeLog } from "./routes/log.ts";
import { routeEtiquette } from "./routes/etiquette.ts";
import { routeComment } from "./routes/comment.ts";
import { routeDoc } from "./routes/doc.ts";
import { routeJournal } from "./routes/journal.ts";
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
app.use(routeTab.routes(), routePoll.allowedMethods());
app.use(routeListe.routes(), routeVote.allowedMethods());
app.use(routeCarte.routes(), routeOption.allowedMethods());
app.use(routeNotif.routes(), routeNotif.allowedMethods());
app.use(routeLog.routes(), routeLog.allowedMethods());
app.use(routeEtiquette.routes(), routeEtiquette.allowedMethods());
app.use(routeComment.routes(), routeComment.allowedMethods());
app.use(routeDoc.routes(), routeDoc.allowedMethods());
app.use(routeJournal.routes(), routeJournal.allowedMethods());

app.addEventListener(
    "listen",
    () => console.log(`Server listening on ${ADDRESS}`),
);

if (import.meta.main) {
    await app.listen({ hostname: HOST, port: PORT });
}

export { app };
