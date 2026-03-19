import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { DatabaseSync } from "node:sqlite";
import { errorMiddleware } from "./middleware/error.ts";

// --- Routes auth ---
import routeAuth from "./routes/auth.ts";

// --- Routes proxy vers Tomcat ---
import routeTableau from "./routes/tableau.ts";
import routeListe from "./routes/liste.ts";
import routeCarte from "./routes/carte.ts";
import routeRole from "./routes/role.ts";
import routeMembre from "./routes/membre.ts";
import routeEtiquette from "./routes/etiquette.ts";
import routeAssocier from "./routes/associer.ts";
import routeJournal from "./routes/journal.ts";
import routeNotification from "./routes/notif.ts";
import routeCommentaire  from "./routes/commentaire.ts";
import routeDocument from "./routes/document.ts";
import routeCompte from "./routes/compte.ts";
import routeProfil from "./routes/profil.ts";


// Base de données SQLite locale.
export const db = new DatabaseSync("./kanban.db");

// Configuration
const PROTOCOL = Deno.env.get("PROTOCOL") ?? "http";
const HOST     = Deno.env.get("HOST")     ?? "0.0.0.0";
const PORT     = Number(Deno.env.get("PORT") ?? "8000");
const ADDRESS  = `${PROTOCOL}://${HOST}:${PORT}`;

const TOMCAT_BASE_URL = Deno.env.get("TOMCAT_BASE_URL");
if (!TOMCAT_BASE_URL) {
    console.error(
        "[FATAL] La variable d'environnement TOMCAT_BASE_URL est manquante. " +
        "Vérifier le fichier .env du serveur Deno."
    );
    Deno.exit(1);
}


// Application
const app = new Application();

// --- Middleware global ---
app.use(oakCors());
app.use(errorMiddleware);

// Routes
app.use(routeAuth.routes(), routeAuth.allowedMethods());
app.use(routeTableau.routes(), routeTableau.allowedMethods());
app.use(routeListe.routes(), routeListe.allowedMethods());
app.use(routeCarte.routes(), routeCarte.allowedMethods());
app.use(routeRole.routes(), routeRole.allowedMethods());
app.use(routeMembre.routes(), routeMembre.allowedMethods());
app.use(routeEtiquette.routes(), routeEtiquette.allowedMethods());
app.use(routeAssocier.routes(), routeAssocier.allowedMethods());
app.use(routeJournal.routes(), routeJournal.allowedMethods());
app.use(routeNotification.routes(), routeNotification.allowedMethods());
app.use(routeCommentaire.routes(), routeCommentaire.allowedMethods());
app.use(routeDocument.routes(), routeDocument.allowedMethods());
app.use(routeCompte.routes(), routeCompte.allowedMethods());
app.use(routeProfil.routes(), routeProfil.allowedMethods());

// Lancement
app.addEventListener(
    "listen",
    () => console.log(
        `[Deno] Serveur démarré sur ${ADDRESS}\n` +
        `[Deno] Proxy Tomcat → ${TOMCAT_BASE_URL}`
    ),
);

if (import.meta.main) {
    await app.listen({ hostname: HOST, port: PORT });
}

export { app };