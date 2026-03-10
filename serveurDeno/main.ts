import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { DatabaseSync } from "node:sqlite";

import routeUser from "./routes/user.ts";
import routePoll from "./routes/poll.ts";
import routeVote from "./routes/vote.ts";
import routeOption from "./routes/option.ts";
import {errorMiddleware} from "./middleware/error.ts";

// --- Database ----
export const db = new DatabaseSync("./polls.db");

// --- WebSocket Management ---
const clients = new Set<WebSocket>();

// --- Application ---

const PROTOCOL = "http";
const HOST = "localhost";
const PORT = 8000;
const ADDRESS = `${PROTOCOL}://${HOST}:${PORT}`;

const app = new Application();

// --- Middleware ---
app.use(oakCors());
app.use(errorMiddleware);

// --- Routes ---
app.use(routeUser.routes(), routeUser.allowedMethods());
app.use(routePoll.routes(), routePoll.allowedMethods());
app.use(routeVote.routes(), routeVote.allowedMethods());
app.use(routeOption.routes(), routeOption.allowedMethods());

app.addEventListener(
    "listen",
    () => console.log(`Server listening on ${ADDRESS}`),
);

if (import.meta.main) {
    await app.listen({ hostname: HOST, port: PORT });
}

export { app };