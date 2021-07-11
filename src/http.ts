import * as z from "zod-endpoints";
import * as http from "http";
import { schema } from "./schema";
import { server } from "./server";
import url from "url";
import querystring from "querystring";

async function readBody(
  req: http.IncomingMessage
): Promise<z.MatchRequest["body"] | undefined> {
  return new Promise((resolve) => {
    const data: string[] = [];
    req.on("data", (chunk) => {
      data.push(chunk);
    });
    req.on("end", () => {
      resolve(
        data.length > 0
          ? { type: "application/json", content: JSON.parse(data.join("")) }
          : undefined
      );
    });
  });
}

async function parseRequest(
  req: http.IncomingMessage
): Promise<z.MatchRequest> {
  const parsed = url.parse(req.url ?? "");
  return {
    method: req.method ?? "GET",
    path:
      (parsed?.pathname?.split("/").slice(1) as [string, ...string[]]) ?? [],
    query: parsed?.query ? querystring.parse(parsed.query) : {},
    headers: req?.headers,
    body: await readBody(req),
  };
}

export async function app(req: http.IncomingMessage, res: http.ServerResponse) {
  const parse = await parseRequest(req);
  const match = z.matchRequest(schema, parse);

  if (match && "defaultValue" in match.shape.name._def) {
    const endpointName = match.shape.name._def.defaultValue() as keyof typeof server;
    // @ts-ignore
    const endpoint = await server[endpointName]?.(parse);
    res.writeHead(
      endpoint.status,
      endpoint.body ? { "Content-Type": endpoint?.body?.type } : undefined
    );
    res.end(JSON.stringify(endpoint?.body?.content));
    return;
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Bad request...");
  }
}
