#!/usr/bin/node
'use strict';

const ArgumentParser = require("argparse").ArgumentParser;
const yaml = require('js-yaml');
const path = require("path");
const fs = require("fs");

const swaggerUI = fs.readFileSync(`${__dirname}/index.html`);
const parser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
});

parser.addArgument([ "FILE" ],  { help: "Input spec, as JSON or YAML" });
parser.addArgument([ "TARGET" ],  { help: "Output directory" });
const args = parser.parseArgs();

const fileType = path.extname(args.FILE);
let swaggerSpec = null;

switch (fileType.toLowerCase()) {
    case ".json":
        swaggerSpec = JSON.parse(fs.readFileSync(args.FILE, "utf8"));
        break;
    case ".yml":
        const yml = fs.readFileSync(args.FILE, "utf8");
        swaggerSpec = yaml.safeLoad(yml);
        break;
    default:
        console.error(`File type ${fileType} not supported. Supported file types: json, yml`);
        process.exit(-1);
}

if (!fs.existsSync(args.TARGET)) {
    fs.mkdirSync(args.TARGET);
}

fs.writeFileSync(`${args.TARGET}/index.html`, swaggerUI);
fs.writeFileSync(`${args.TARGET}/spec.json`, JSON.stringify(swaggerSpec));

console.log(`Swagger docs generated at ${args.TARGET}`);
