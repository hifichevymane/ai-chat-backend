// @deno-types="npm:@types/express@5.0.0"
import express from "npm:express@4.21.2";

const app = express();

app.get('/health-check', (_, res) => {
  res.json({ code: 200, status: 'OK' });
});

app.listen(3000, () => {
  console.log(`Server is running on ${3000} port`);
});
