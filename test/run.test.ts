import http from "http";

import {app} from "../src/http";
import {client} from "../src/client";

const server = http.createServer(app).listen(5000, () => console.log("Start..."));

afterAll(() => {
  server.close()
});


test("parameter with number", async () => {

  const id = "1a2c8758-e223-11eb-ba80-0242ac130004" as string
  const project = {
    id: id,
    name: "Todo 12",
  }

  const resPost = await client({
    method: "POST",
    path: ["projects"],
    body: {
      type: "application/json",
      content: project,
    },
    query: {},
    headers: {},
  })

  expect(resPost).toStrictEqual({
    "status": 201,
    "headers": undefined,
    "body": undefined
  })

  const resGetList = await client({
    method: "GET",
    path: ["projects"],
    query: {},
    headers: {},
  })

  expect(resGetList).toStrictEqual({
    "status": 200,
    "headers": undefined,
    "body": {
      "type": "application/json",
      "content": [project]
    }
  })

  const resGetId = await client({
    method: "GET",
    path: ["projects", id],
    query: {},
    headers: {},
  })

  expect(resGetId).toStrictEqual({
    "status": 200,
    "headers": undefined,
    "body": {
      "type": "application/json",
      "content": project
    }
  })

})