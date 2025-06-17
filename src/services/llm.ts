import ollama from 'ollama';
import type { ChatResponse, AbortableAsyncIterator } from 'ollama';
import { ChatMessageRoleEnum } from '../database/prisma/src/generated/prisma';

interface ChatMessageDTO {
  role: ChatMessageRoleEnum;
  content: string;
}

interface LLMResponse {
  role: ChatMessageRoleEnum;
  content: string;
}

export class LLMService {
  public async loadModel(): Promise<boolean> {
    const { done } = await ollama.generate({
      model: process.env.MODEL_ID,
      prompt: ''
    });

    return done;
  }

  public async unloadModel(): Promise<boolean> {
    const { done } = await ollama.generate({
      model: process.env.MODEL_ID,
      prompt: '',
      keep_alive: 0
    });

    return done;
  }

  public streamPromptResponse(
    prompt: string,
    context: ChatMessageDTO[] = []
  ): Promise<AbortableAsyncIterator<ChatResponse>> {
    const messages: ChatMessageDTO[] = [
      ...context,
      { role: ChatMessageRoleEnum.user, content: prompt }
    ];

    return ollama.chat({
      model: process.env.MODEL_ID,
      messages,
      stream: true
    });
  }

  public responseFromChunks(chunks: string[]): LLMResponse {
    return { role: ChatMessageRoleEnum.assistant, content: chunks.join('') };
  }
}
