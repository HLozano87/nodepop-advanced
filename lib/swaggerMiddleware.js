import yaml from "js-yaml";
import swaggerUI from "swagger-ui-express";
import fs from "fs/promises";
import path from "path";

const swaggerPath = path.join(process.cwd(), "swagger.yaml");

const fileContent = await fs.readFile(swaggerPath, "utf8");
const swaggerDocument = yaml.load(fileContent);

export default [swaggerUI.serve, swaggerUI.setup(swaggerDocument)];
