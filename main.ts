// @deno-types="npm:@types/express@5.0.0"
import express from "npm:express@4.21.2";
import "@std/dotenv/load";

const app = express();

app.get('/health-check', (_, res) => {
  res.json({ code: 200, status: 'OK' });
});

const APP_PORT: number = Number(Deno.env.get('APP_PORT')) || 8000;
app.listen(APP_PORT, () => {
  console.log(`Server is running on ${APP_PORT} port`);
});
