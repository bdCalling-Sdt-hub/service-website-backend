import app from "./src/app";
import http from "http";

const PORT = 9000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});