import ollama from 'ollama';
import { ChatMessageDTO, Role } from '../entities/chat-message.ts';
import { AbortableAsyncIterator, ChatResponse } from 'ollama';

interface LLMResponse {
  role: Role.ASSISTANT;
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
      { role: Role.USER, content: prompt }
    ];

    return ollama.chat({
      model: process.env.MODEL_ID,
      messages,
      stream: true
    });
  }

  public responseFromChunks(chunks: string[]): LLMResponse {
    return { role: Role.ASSISTANT, content: chunks.join('') };
  }
}
