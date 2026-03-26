import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { env } from "./lib/env";
import { registerRoutes } from "./routes";

const app = Fastify({
  logger: true
});

await app.register(cors, {
  origin: true
});

await app.register(rateLimit, {
  max: 120,
  timeWindow: "1 minute"
});

await registerRoutes(app);

app.listen({ port: env.port, host: "0.0.0.0" }).then(() => {
  app.log.info(`GymFlow backend running on ${env.port}`);
});
