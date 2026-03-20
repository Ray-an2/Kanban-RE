import { APIErreurCode, APIException } from "../model/reponse.ts";
import { type AuthContext } from "../model/auth.ts";

const TOMCAT_BASE_URL = Deno.env.get("TOMCAT_BASE_URL");
const TOMCAT_TIMEOUT_MS = 10_000;

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

async function extractTomcatErrorMessage(response: Response): Promise<string> {
  try {
    const text = await response.text();
    if (!text) return `Erreur serveur (HTTP ${response.status})`;
    const json = JSON.parse(text);
    return json.message ?? json.error ?? `Erreur serveur (HTTP ${response.status})`;
  } catch {
    return `Erreur serveur (HTTP ${response.status})`;
  }
}

export async function proxyToTomcat(ctx: AuthContext): Promise<void> {
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

  const headers = new Headers(ctx.request.headers);
  headers.delete("host");

  let bodyBytes: Uint8Array | undefined;
  const method = ctx.request.method;
  const hasBody = ctx.request.hasBody && method !== "GET" && method !== "HEAD";

  if (hasBody) {
    // Oak 17 : ctx.request.body.arrayBuffer() remplace ctx.request.body({ type: "bytes" }).value
    const rawBuffer = await ctx.request.body.arrayBuffer();
    const bytes = new Uint8Array(rawBuffer);

    // Injecter l'auteur dans le body JSON si l'utilisateur est connecté
    const contentType = ctx.request.headers.get("content-type") ?? "";
    const auteur = ctx.state.user?.cpt_pseudo;

    const cptId = ctx.state.user?.cpt_id;
    if (auteur && contentType.includes("application/json") && bytes.length > 0) {
      try {
        const text = new TextDecoder().decode(bytes);
        const json = JSON.parse(text);
        // Injecter auteur (pseudo) et cptId pour la création de rôle côté Tomcat
        if (!json.auteur) json.auteur = auteur;
        if (!json.cptId && cptId) json.cptId = cptId;
        const enriched = new TextEncoder().encode(JSON.stringify(json));
        bodyBytes = enriched;
        headers.set("content-length", enriched.length.toString());
      } catch {
        bodyBytes = bytes;
      }
    } else {
      bodyBytes = bytes;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TOMCAT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(targetUrl.toString(), {
      method,
      headers,
      body: bodyBytes,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new APIException(
          APIErreurCode.TIMEOUT,
          504,
          "Le serveur de traitement n'a pas répondu dans les délais.",
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const message = await extractTomcatErrorMessage(response);
    throw new APIException(
        tomcatStatusToErreurCode(response.status),
        response.status,
        message,
    );
  }

  ctx.response.status = response.status;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    ctx.response.headers.set(key, value);
  });

  if (method !== "HEAD") {
    const buffer = await response.arrayBuffer();
    ctx.response.body = new Uint8Array(buffer);
  }
}