import tls from "node:tls";

const target = new URL(process.env.TLS_CHECK_URL ?? "https://localhost:3443");
const socket = tls.connect({
  host: target.hostname,
  port: Number(target.port || 443),
  servername: target.hostname,
  minVersion: "TLSv1.2",
  rejectUnauthorized: false
});

socket.once("secureConnect", () => {
  const protocol = socket.getProtocol();
  console.log(`${target.origin} negotiated ${protocol}`);
  socket.end();
  if (protocol !== "TLSv1.2" && protocol !== "TLSv1.3") process.exitCode = 1;
});
socket.once("error", error => {
  console.error(`TLS check failed: ${error.message}`);
  process.exitCode = 1;
});
