#! /bin/bash

const os = require("os");
const fs = require("fs");
const path = require("path");
const util = require("util");
const zlib = require("zlib");
const exec = util.promisify(require("child_process").exec);
const Terser = require("terser");

const pReadFile = util.promisify(fs.readFile);
const pWriteFile = util.promisify(fs.writeFile);
const pStat = util.promisify(fs.stat);

const UNCOMPRESSED_BYTE_LIMIT = 2000;
const ZIPPED_BYTE_LIMIT = 500;
const COMPRESSED_BYTE_LIMIT = 300;

const tmpdir = os.tmpdir();

async function checkSize(filepath, limit) {
  const stats = await pStat(filepath);
  if (stats.size > limit) {
    return Promise.reject(stats.size);
  }

  return Promise.resolve(stats.size);
}

async function compress(filepath) {
  const { name, ext } = path.parse(filepath);
  const outputPath = `${tmpdir}/${name}.min${ext}`;
  const contents = await pReadFile(filepath, "utf8");
  await pWriteFile(outputPath, Terser.minify(contents).code, "utf8");

  return outputPath;
}

function gzip(filepath) {
  return new Promise(resolve => {
    const { base } = path.parse(filepath);
    const outputPath = `${tmpdir}/${base}.gz`;
    fs.createReadStream(filepath)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(outputPath))
      .on("close", () => resolve(outputPath));
  });
}

function failCheck(expected, actual) {
  console.error(
    `Check failed! Expected to be under: ${expected}; actual: ${actual}`
  );
  process.exit(1);
}

async function runChecks() {
  const filepath = process.argv.pop();
  let bytes;

  try {
    console.log(`Uncompressed check; limit: ${UNCOMPRESSED_BYTE_LIMIT}`);
    bytes = await checkSize(filepath, UNCOMPRESSED_BYTE_LIMIT);
    console.log(`\t✅ bytes: ${bytes}`);
  } catch (e) {
    return failCheck(UNCOMPRESSED_BYTE_LIMIT, e);
  }

  try {
    console.log(`Uncompressed gzip check; limit: ${ZIPPED_BYTE_LIMIT}`);
    const gzipPath = await gzip(filepath);
    bytes = await checkSize(gzipPath, ZIPPED_BYTE_LIMIT);
    console.log(`\t✅ bytes: ${bytes}`);
  } catch (e) {
    return failCheck(ZIPPED_BYTE_LIMIT, e);
  }

  try {
    console.log(`Compressed gzip check; limit: ${COMPRESSED_BYTE_LIMIT}`);
    const compressPath = await compress(filepath);
    const compressGzipPath = await gzip(compressPath);
    bytes = await checkSize(compressGzipPath, COMPRESSED_BYTE_LIMIT);
    console.log(`\t✅ bytes: ${bytes}`);
  } catch (e) {
    return failCheck(COMPRESSED_BYTE_LIMIT, e);
  }
}

runChecks();
