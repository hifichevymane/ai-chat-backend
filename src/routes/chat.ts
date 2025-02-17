// @deno-types="npm:@types/express@5.0.0"
import { Router, Request, Response } from "npm:express@4.21.2";
import "@std/dotenv/load";
import OpenAI from "@openai/openai";

const API_KEY = Deno.env.get('API_KEY');
const LLM_BASE_URL = Deno.env.get('LLM_BASE_URL');
const MODEL_ID = Deno.env.get('MODEL_ID') || '';

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: LLM_BASE_URL
});

const router = Router();

type EmptyObject = Record<string | number | symbol, never>;

interface ChatRequestBody {
  prompt: string
}

interface ChatResponseBody {
  message: string | null;
}

interface ErrorResponseBody {
  error: string;
}

type ChatRequest = Request<EmptyObject, ChatResponseBody | ErrorResponseBody, ChatRequestBody>;

router.post('/chat', async (req: ChatRequest, res: Response) => {
  try {
    const { prompt } = req.body;

    const response = await client.chat.completions.create({
      model: MODEL_ID,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    })

    res.json({ message: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
