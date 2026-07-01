import { defineMiddleware } from "astro:middleware";

// Protege /presentacion con HTTP Basic Auth a nivel de servidor.
// La contrasena vive en Cloudflare Pages como variable de entorno secreta
// llamada PRESENTACION_PASSWORD. En local, usa un archivo .dev.vars.
function isAuthorized(header: string | null, password: string | undefined) {
  if (!password) return false;
  if (!header || !header.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice(6));
    const separatorIndex = decoded.indexOf(":");
    return decoded.slice(separatorIndex + 1) === password;
  } catch {
    return false;
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname !== "/presentacion") {
    return next();
  }

  const runtimeEnv = (context.locals as any).runtime?.env ?? {};
  const expectedPassword = runtimeEnv.PRESENTACION_PASSWORD;
  const authHeader = context.request.headers.get("authorization");

  if (!isAuthorized(authHeader, expectedPassword)) {
    return new Response("Autenticación requerida", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Rotary Casa Flora"' },
    });
  }

  return next();
});
