import * as z from "zod-endpoints";
import {service} from "./service";
import {schema} from "./schema";

export const server: z.Api<typeof schema> = {
  LIST_PROJECT: () =>
    service.findProjectAll().then((content) => ({
      status: 200,
      body: {
        type: "application/json",
        content,
      },
    })),

  GET_PROJECT: async ({path:[_, id]}) => {
    try {
      return await service
        .findProjectById(id)
        .then(
          (content) =>
            ({
              status: 200,
              body: {
                type: "application/json",
                content,
              },
            })
        )
    } catch (err) {
      return {
        status: 500,
        body: {
          type: "application/json",
          content: {
            code: 112,
            message: err.message,
          },
        },
      }
    }
  },
  CREATE_PROJECT: ({body}) => service.createProject(body.content).then(() => ({status: 201}))
};
