import ollama from 'ollama';
import { AbortableAsyncIterator, ChatResponse } from 'ollama';
import { chat_messages_role_enum as Role } from '../database/prisma/src/generated/prisma';

interface ChatMessageDTO {
  role: Role;
  content: string;
}

interface LLMResponse {
  role: Role;
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
      { role: Role.user, content: prompt }
    ];

    return ollama.chat({
      model: process.env.MODEL_ID,
      messages,
      stream: true
    });
  }

  public responseFromChunks(chunks: string[]): LLMResponse {
    return { role: Role.assistant, content: chunks.join('') };
  }
}
