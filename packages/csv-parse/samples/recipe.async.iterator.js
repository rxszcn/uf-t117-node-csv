import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(`${__dirname}/fs_read.csv`).pipe(
    parse({
      // CSV options if any
    }),
  );
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  console.info(records);
})();
