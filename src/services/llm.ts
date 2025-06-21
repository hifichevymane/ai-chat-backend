import ora from 'ora';
import { Ollama } from 'ollama';
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

const ollama = new Ollama({
  host: `http://${process.env.OLLAMA_HOST}:${process.env.OLLAMA_PORT}`
});

export class LLMService {
  private async isModelPulled(modelId: string): Promise<boolean> {
    const { models } = await ollama.list();
    return models.some(({ model }) => model === modelId);
  }

  private async pullModel(model: string): Promise<boolean> {
    const spinner = ora(`Pulling model "${model}" from Ollama...`).start();
    try {
      const progressStream = await ollama.pull({ model, stream: true });

      for await (const progress of progressStream) {
        if (progress.status) {
          spinner.text = `Pulling model "${model}": ${progress.status}`;
        }
        if (progress.completed && progress.total) {
          const percent = ((progress.completed / progress.total) * 100).toFixed(
            2
          );
          spinner.text = `Pulling model "${model}": ${percent}%`;
        }
      }

      spinner.succeed(`Model "${model}" pulled successfully!`);
      return true;
    } catch (error) {
      spinner.fail(`Error pulling model "${model}": ${error}`);
      return false;
    }
  }

  public async loadModel(modelId: string): Promise<boolean> {
    const isModelPulled = await this.isModelPulled(modelId);
    if (!isModelPulled) {
      console.warn(`WARNING: Model ${modelId} is not pulled, pulling...`);
      const isPulled = await this.pullModel(modelId);
      if (!isPulled) {
        throw new Error(`ERROR: Failed to pull model ${modelId}`);
      } else {
        console.log(`SUCCESS: Model ${modelId} has been pulled successfully!`);
      }
    }

    const { done } = await ollama.generate({
      model: modelId,
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
