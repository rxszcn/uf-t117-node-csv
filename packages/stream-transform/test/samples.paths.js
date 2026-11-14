import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Lock the sample loader path resolution across platforms. On Windows, the
// historical `new URL(".", import.meta.url).pathname` form yields "/D:/...",
// which `path.resolve` turns into "D:\D:\...". The loader must instead derive
// a native path so samples are listed and executed on every platform.

const testDir = path.dirname(fileURLToPath(import.meta.url));
const samplesDir = path.resolve(testDir, "../samples");

describe("Samples paths", function () {
  it("resolves a native absolute path", function () {
    assert.equal(path.isAbsolute(samplesDir), true);
    assert.equal(samplesDir, path.normalize(samplesDir));
    if (process.platform === "win32") {
      // A drive letter must appear exactly once, ie not "D:\D:\...".
      const driveLetters = samplesDir
        .split(path.sep)
        .filter((segment) => /^[a-zA-Z]:$/.test(segment));
      assert.equal(driveLetters.length, 1, samplesDir);
      // The URL form ("/D:/...") is not a usable filesystem path, resolving it
      // prepends the current drive and produces the illegal "D:\D:\..." shape.
      const urlPathname = new URL(".", import.meta.url).pathname;
      assert.match(urlPathname, /^\/[a-zA-Z]:\//);
      const fromUrlForm = path.resolve(urlPathname, "../samples");
      assert.notEqual(fromUrlForm, samplesDir);
      assert.match(fromUrlForm, /^[a-zA-Z]:\\[a-zA-Z]:\\/);
    }
  });

  it("lists the samples directory", async function () {
    const stat = await fs.stat(samplesDir);
    assert.equal(stat.isDirectory(), true);
    const samples = await fs.readdir(samplesDir);
    assert.ok(samples.length > 0);
  });

  it("exposes every sample through an absolute path", async function () {
    const samples = await fs.readdir(samplesDir);
    const runnable = samples.filter((sample) => /\.(js|ts)$/.test(sample));
    assert.ok(runnable.length > 0);
    for (const sample of runnable) {
      const filepath = path.resolve(samplesDir, sample);
      assert.equal(path.isAbsolute(filepath), true, filepath);
      const stat = await fs.stat(filepath);
      assert.equal(stat.isFile(), true, filepath);
    }
  });

  it("derives the directory with a cross platform API", async function () {
    const loader = await fs.readFile(
      path.resolve(testDir, "samples.js"),
      "utf8",
    );
    // `.pathname` keeps the URL form ("/D:/...") and must not be used as a
    // filesystem path, it is turned into "D:\D:\..." by `path.resolve`.
    assert.doesNotMatch(loader, /import\.meta\.url\)\.pathname/);
    assert.match(loader, /fileURLToPath\(import\.meta\.url\)/);
  });
});
