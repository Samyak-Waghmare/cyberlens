import { createApp } from "./src/app.js";
import { config } from "./src/config/env.js";

const app = createApp();

// When deployed to Vercel the file is imported as a serverless function, so
// only start a listener when run directly (local dev).
if (!config.isServerless) {
  app.listen(config.port);
}

export default app;
