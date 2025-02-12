// @deno-types="npm:@types/express@5.0.0"
import express from "npm:express@4.21.2";
import "@std/dotenv/load";
import OpenAI from "@openai/openai";

const app = express();

const APP_PORT = Number(Deno.env.get('APP_PORT')) || 8000;
const API_KEY = Deno.env.get('API_KEY');
const LLM_BASE_URL = Deno.env.get('LLM_BASE_URL');
const MODEL_ID = Deno.env.get('MODEL_ID') || '';

app.use(express.json());

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: LLM_BASE_URL
})

app.get('/health-check', (_, res) => {
  res.json({ code: 200, status: 'OK' });
});

app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await client.chat.completions.create({
      model: MODEL_ID,
      messages: [{ role: 'user', content: prompt }]
    })

    res.json({ message: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(APP_PORT, () => {
  console.log(`Server is running on ${APP_PORT} port`);
});
