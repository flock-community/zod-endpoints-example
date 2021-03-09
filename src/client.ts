import * as z from "zod-endpoints";
import { schema } from "./schema";
import fetch, { RequestInfo, RequestInit } from "node-fetch";

type Request = z.output<z.HttpRequestObject>;

function requestToUrl(obj: Request): RequestInfo {
  const path = obj.path ? obj.path.join("/") : "/";
  const query = Object.keys(obj.query)
    .map<string>((it) => `${it}=${obj?.query?.[it]}`)
    .join("&");
  return "http://localhost:5000/" + (query ? path + "?" + query : path);
}

function requestToOptions(obj: Request): RequestInit {
  return {
    method: obj.method,
    headers: {
      ...obj.headers,
      ...(obj.body?.type ? { "content-type": obj.body?.type } : {}),
    },
    body: JSON.stringify(obj.body?.content),
  };
}

// @ts-ignore
export const client: z.Client<typeof schema> = async (req) => {
  const technicalHeaders = ["date", "connection", "transfer-encoding"];
  const url = requestToUrl(req);
  const options = requestToOptions(req);
  const res = await fetch(url, options).then(async (it) => {
    const type = it.headers.get("content-type");
    const headers = Array.from(it.headers.keys())
      .filter((it) => it !== "content-type")
      .filter((it) => !technicalHeaders.includes(it))
      .reduce((acc, cur) => ({ ...acc, [cur]: it.headers.get(cur) }), {});
    return {
      status: it.status,
      headers: Object.entries(headers).length > 0 ? headers : undefined,
      body: type
        ? {
            type: type,
            content: await it.json(),
          }
        : undefined,
    };
  });

  const match = z.matchRequest(schema, req);
  if (res && match && z.matchResponse(match.shape.responses, res)) {
    return res;
  } else {
    throw new Error("Response not valid");
  }
};
