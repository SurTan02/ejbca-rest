import { HOSTNAME, PORT } from "./config/config";
import { createServer } from "./server";

const hostname = HOSTNAME;
const port = PORT;
const server = createServer();

server.listen(port, () => {
  console.log(`[Cert] running on http://${hostname}:${port}`);
});