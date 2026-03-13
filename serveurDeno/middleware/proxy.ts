import { Context } from "@oak/oak";

const TOMCAT_URL = Deno.env.get("TOMCAT_URL");

export async function proxyToTomcat(ctx: Context) {
  const targetUrl = new URL(
    `${ctx.request.url.pathname}${ctx.request.url.search}`,
    TOMCAT_URL,
  );

  const headers = new Headers(ctx.request.headers);
  headers.delete("host");

  let body: Uint8Array | undefined;
  if (ctx.request.hasBody && ctx.request.method !== "GET" && ctx.request.method !== "HEAD") {
    const raw = await ctx.request.body({ type: "bytes" }).value;
    body = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
  }

  const response = await fetch(targetUrl.toString(), {
    method: ctx.request.method,
    headers,
    body,
  });

  ctx.response.status = response.status;

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    ctx.response.headers.set(key, value);
  });

  if (ctx.request.method !== "HEAD") {
    const buffer = await response.arrayBuffer();
    ctx.response.body = new Uint8Array(buffer);
  }
}
