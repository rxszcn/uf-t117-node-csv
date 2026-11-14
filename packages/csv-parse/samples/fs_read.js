import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const parser = parse({ delimiter: ";" }, function (err, data) {
  console.info(data);
});

fs.createReadStream(__dirname + "/fs_read.csv").pipe(parser);
