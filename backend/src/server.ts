import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
app.listen(env.port, () => {
  console.log(`🚚 Routelyn API running on http://localhost:${env.port}`);
});
