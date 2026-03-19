import { Context } from "@oak/oak";
import { APIErreurCode, APIException, APIFailure } from "../model/reponse.ts";

const TOMCAT_BASE_URL = Deno.env.get("TOMCAT_BASE_URL");

// Délai maximum d'attente d'une réponse Tomcat (10 secondes)
const TOMCAT_TIMEOUT_MS = 10_000;

/**
 * Mappe le code HTTP retourné par Tomcat vers un APIErreurCode Deno.
 */
function tomcatStatusToErreurCode(status: number): APIErreurCode {
  switch (true) {
    case status === 400: return APIErreurCode.BAD_REQUEST;
    case status === 401: return APIErreurCode.UNAUTHORIZED;
    case status === 403: return APIErreurCode.ROLE_UNAUTHORIZED;
    case status === 404: return APIErreurCode.NOT_FOUND;
    case status === 409: return APIErreurCode.VALIDATION_ERROR;
    case status >= 500:  return APIErreurCode.TOMCAT_ERROR;
    default:             return APIErreurCode.SERVER_ERROR;
  }
}

/**
 * Tente d'extraire un message d'erreur lisible depuis la réponse Tomcat.
 * Tomcat Spring Boot retourne par défaut un JSON avec un champ "message".
 * Si le parsing échoue, on retourne un message générique.
 */
async function extractTomcatErrorMessage(response: Response): Promise<string> {
  try {
    const text = await response.text();
    if (!text) return `Erreur serveur (HTTP ${response.status})`;
    const json = JSON.parse(text);
    // Spring Boot retourne { "message": "..." } ou { "error": "...", "message": "..." }
    return json.message ?? json.error ?? `Erreur serveur (HTTP ${response.status})`;
  } catch {
    return `Erreur serveur (HTTP ${response.status})`;
  }
}

/**
 * Relaie une requête vers Tomcat et retourne la réponse au client.
 *
 * Comportement :
 *  - Si Tomcat répond avec 2xx/3xx : la réponse est retournée telle quelle.
 *  - Si Tomcat répond avec 4xx/5xx : on extrait le message d'erreur et on
 *    lève une APIException pour que errorMiddleware la formate en APIFailure.
 *  - Si Tomcat est injoignable (réseau KO) : TypeError capturée par errorMiddleware.
 *  - Si Tomcat ne répond pas dans le délai : AbortError → TIMEOUT.
 */
export async function proxyToTomcat(ctx: Context): Promise<void> {
  if (!TOMCAT_BASE_URL) {
    throw new APIException(
        APIErreurCode.SERVER_ERROR,
        500,
        "Variable d'environnement TOMCAT_BASE_URL manquante.",
    );
  }

  const targetUrl = new URL(
      `${ctx.request.url.pathname}${ctx.request.url.search}`,
      TOMCAT_BASE_URL,
  );

  // Copier les headers de la requête entrante (sauf host)
  const headers = new Headers(ctx.request.headers);
  headers.delete("host");

  // Lire le body pour les méthodes non-GET
  let body: Uint8Array | undefined;
  if (
      ctx.request.hasBody &&
      ctx.request.method !== "GET" &&
      ctx.request.method !== "HEAD"
  ) {
    const raw = await ctx.request.body({ type: "bytes" }).value;
    body = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
  }

  // Timeout via AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TOMCAT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(targetUrl.toString(), {
      method: ctx.request.method,
      headers,
      body,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);

    // Timeout
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new APIException(
          APIErreurCode.TIMEOUT,
          504,
          "Le serveur de traitement n'a pas répondu dans les délais.",
      );
    }
    // Réseau KO — remontée vers errorMiddleware qui gère TypeError
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  // --- Réponse en erreur de Tomcat ---
  if (!response.ok) {
    const message = await extractTomcatErrorMessage(response);
    throw new APIException(
        tomcatStatusToErreurCode(response.status),
        response.status,
        message,
    );
  }

  // --- Réponse OK : retransmettre telle quelle ---
  ctx.response.status = response.status;

  response.headers.forEach((value, key) => {
    // Transfer-Encoding chunked est géré par Oak lui-même
    if (key.toLowerCase() === "transfer-encoding") return;
    ctx.response.headers.set(key, value);
  });

  if (ctx.request.method !== "HEAD") {
    const buffer = await response.arrayBuffer();
    ctx.response.body = new Uint8Array(buffer);
  }
}