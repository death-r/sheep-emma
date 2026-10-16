import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import wisp from "wisp-server-node";

const app = express();
const publicDir = fileURLToPath(new URL("./public/", import.meta.url));

// Our own files first, so public/uv/uv.config.js overrides the library default.
app.use(express.static(publicDir));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

const server = createServer(app);

// The proxy traffic travels over a WebSocket at /wisp/
server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
  else socket.destroy();
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Emma Sheep running on port ${port}`));
