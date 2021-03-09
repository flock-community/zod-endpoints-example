import * as z from "zod-endpoints";
import { service } from "./service";
import { schema } from "./schema";

export const server: z.Api<typeof schema> = {
  LIST_PROJECT: () =>
    service.findProjectAll().then((content) => ({
      status: 200,
      body: {
        type: "application/json",
        content,
      },
    })),

  GET_PROJECT: ({ path }) =>
    service
      .findProjectById(path[1])
      .then(
        (content) =>
          ({
            status: 200,
            body: {
              type: "application/json",
              content,
            },
          } as const)
      )
      .catch(
        (err) =>
          ({
            status: 500,
            body: {
              type: "application/json",
              content: {
                code: 112,
                message: err.message,
              },
            },
          } as const)
      ),

  CREATE_PROJECT: ({ body }) =>
    service.createProject(body.content).then(() => ({
      status: 201,
    })),
};
