import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Using the first line of the CSV data to discover the column names
const rs = fs.createReadStream(__dirname + "/columns-discovery.in");
const parser = parse({ columns: true }, function (err, data) {
  console.info(data);
});
rs.pipe(parser);

/*

`node samples/header-based-columns.js`

[ { Foo: 'first', Bar: 'row', Baz: 'items' },
  { Foo: 'second', Bar: 'row', Baz: 'items' } ]

*/
