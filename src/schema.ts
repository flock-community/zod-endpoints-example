import * as z from "zod-endpoints";

const project = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const error = z.object({
  code: z.number(),
  message: z.string(),
});

const errorResponse = z.response({
  status: 500,
  description: "Error occurred",
  body: z.body({
    type: "application/json",
    content: error,
  }),
});

export type Project = z.infer<typeof project>;
export type Error = z.infer<typeof error>;
export type Schema = z.output<typeof schema>;

export const schema = z.endpoints([

  z.endpoint({
    name: "GET_PROJECT",
    method: "GET",
    path: z.path("projects", z.string().uuid()),
    responses: [
      z.response({
        description: "Found project",
        status: 200,
        body: z.body({
          type: "application/json",
          content: project,
        }),
      }),
      z.response({
        description: "Not found",
        status: 404,
        body: z.body({
          type: "application/json",
          content: error,
        }),
      }),
      errorResponse,
    ],
  }),
  z.endpoint({
    name: "LIST_PROJECT",
    method: "GET",
    path: z.path("projects"),
    headers: {},
    responses: [
      z.response({
        description: "Found project",
        status: 200,
        body: z.body({
          type: "application/json",
          content: z.array(project),
        }),
      }),
      errorResponse,
    ],
  }),
  z.endpoint({
    name: "CREATE_PROJECT",
    method: "POST",
    path: z.path("projects"),
    body: z.body({
      type: "application/json",
      content: project,
    }),
    responses: [
      z.response({
        description: "Created project",
        status: 201,
      }),
      errorResponse,
    ],
  }),
]);

export const openApi = z.openApi(schema, {
  title: "Project API",
  version: "1.0.5",
});
