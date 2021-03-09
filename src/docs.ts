import * as z from "zod-endpoints";
import { schema } from "./schema";

const docs = JSON.stringify(z.openApi(schema), null, 4);

console.log(docs);
