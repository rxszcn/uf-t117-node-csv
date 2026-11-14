import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { finished } from "node:stream/promises";
import { parse, transform, stringify } from "csv";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
await fs.promises.writeFile(
  `${__dirname}/example.fs.input.csv`,
  "a,b,c\n1,2,3",
);

await finished(
  fs
    .createReadStream(`${__dirname}/example.fs.input.csv`)
    .pipe(parse())
    .pipe(transform((record) => record.reverse()))
    .pipe(stringify())
    .pipe(fs.createWriteStream(`${__dirname}/example.fs.output.csv`)),
);

assert.equal(
  await fs.promises.readFile(`${__dirname}/example.fs.output.csv`, "utf8"),
  "c,b,a\n3,2,1\n",
);
