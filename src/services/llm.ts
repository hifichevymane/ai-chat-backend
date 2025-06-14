import ollama from 'ollama';
import { ChatMessageDTO, Role } from '../entities/chat-message';
import { AbortableAsyncIterator, ChatResponse } from 'ollama';

interface LLMResponse {
  role: Role.ASSISTANT;
  content: string;
}

export class LLMService {
  public async streamPromptResponse(
    prompt: string,
    context: ChatMessageDTO[] = []
  ): Promise<AbortableAsyncIterator<ChatResponse>> {
    const messages: ChatMessageDTO[] = [
      ...context,
      { role: Role.USER, content: prompt }
    ];

    return await ollama.chat({
      model: process.env.MODEL_ID,
      messages,
      stream: true
    });
  }

  public responseFromChunks(chunks: string[]): LLMResponse {
    return { role: Role.ASSISTANT, content: chunks.join('') };
  }
}
