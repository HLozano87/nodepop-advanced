/**
 * Module dependencies.
 */
import "dotenv/config";
import http from "node:http";
import app from "./app.js";

const port = process.env.PORT || 3000;

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port and http event listening, on all network interfaces.
 */

server.on("error", (error) => console.error("Error: ", error));
server.on("listening", () => {
  console.log(`Server started on http://localhost:${port}`);
  console.log(`Docs started on http://localhost:${port}/api-docs`);
});
server.listen(port);
