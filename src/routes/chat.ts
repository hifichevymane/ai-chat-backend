// @deno-types="@types/express"
import { Request, Response, Router } from 'express';
import '@std/dotenv/load';
import OpenAI from '@openai/openai';

const API_KEY = Deno.env.get('API_KEY');
const LLM_BASE_URL = Deno.env.get('LLM_BASE_URL');
const MODEL_ID = Deno.env.get('MODEL_ID') || '';

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: LLM_BASE_URL,
});

const router = Router();

type EmptyObject = Record<string | number | symbol, never>;

interface ChatRequestBody {
  prompt: string;
}

interface ChatResponseBody {
  message: string | null;
}

interface ErrorResponseBody {
  error: string;
}

type ChatRequest = Request<
  EmptyObject,
  ChatResponseBody | ErrorResponseBody,
  ChatRequestBody
>;

router.post('/chat', async (req: ChatRequest, res: Response) => {
  try {
    const { prompt } = req.body;

    const stream = await client.chat.completions.create({
      model: MODEL_ID,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || '');
    }
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
