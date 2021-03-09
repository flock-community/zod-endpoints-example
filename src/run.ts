import "./run";
import { client } from "./client";

const run = async () => {
  const id = "8ca9b070-2e97-11eb-adc1-0242ac120002";
  await client({
    method: "POST",
    path: ["projects"],
    body: {
      type: "application/json",
      content: {
        id,
        name: "Todo 12",
      },
    },
    query: {},
    headers: {},
  }).then((res) => {
    if (res.status === 201) {
      console.log(JSON.stringify(res, null, 4));
    }
  });
  await client({
    method: "GET",
    path: ["projects", id],
    query: {},
    headers: {},
  }).then((res) => {
    //if (res.status === 200) {
    console.log(JSON.stringify(res, null, 4));
    //}
  });
};
run();
