import fs from "node:fs";
import https from "node:https";
import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3001);
const app = createApp();
const hasCertificate = Boolean(process.env.TLS_CERT_FILE || process.env.TLS_KEY_FILE);
if (hasCertificate && (!process.env.TLS_CERT_FILE || !process.env.TLS_KEY_FILE)) {
  throw new Error("TLS_CERT_FILE and TLS_KEY_FILE must be provided together.");
}
const server = hasCertificate
  ? https.createServer({
      cert: fs.readFileSync(process.env.TLS_CERT_FILE),
      key: fs.readFileSync(process.env.TLS_KEY_FILE),
      minVersion: "TLSv1.2"
    }, app)
  : app;
server.listen(port, () => {
  console.log(`Online Quiz System API listening on ${hasCertificate ? "https" : "http"}://localhost:${port}`);
});
