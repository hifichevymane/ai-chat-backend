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
  private modelId: string;

  constructor(modelId: string) {
    this.modelId = modelId;
  }

  private async isModelPulled(): Promise<boolean> {
    const { models } = await ollama.list();
    return models.some(({ model }) => model === this.modelId);
  }

  private async pullModel(): Promise<boolean> {
    const spinner = ora(
      `Pulling model "${this.modelId}" from Ollama...`
    ).start();
    try {
      const progressStream = await ollama.pull({
        model: this.modelId,
        stream: true
      });

      for await (const progress of progressStream) {
        if (progress.status) {
          spinner.text = `Pulling model "${this.modelId}": ${progress.status}`;
        }
        if (progress.completed && progress.total) {
          const percent = ((progress.completed / progress.total) * 100).toFixed(
            2
          );
          spinner.text = `Pulling model "${this.modelId}": ${percent}%`;
        }
      }

      spinner.succeed(`Model "${this.modelId}" pulled successfully!`);
      return true;
    } catch (error) {
      spinner.fail(`Error pulling model "${this.modelId}": ${error}`);
      return false;
    }
  }

  public async loadModel(): Promise<boolean> {
    const isModelPulled = await this.isModelPulled();
    if (!isModelPulled) {
      console.warn(`WARNING: Model ${this.modelId} is not pulled, pulling...`);
      const isPulled = await this.pullModel();
      if (!isPulled) {
        throw new Error(`ERROR: Failed to pull model ${this.modelId}`);
      } else {
        console.log(
          `SUCCESS: Model ${this.modelId} has been pulled successfully!`
        );
      }
    }

    const { done } = await ollama.generate({
      model: this.modelId,
      prompt: ''
    });

    return done;
  }

  public async unloadModel(): Promise<boolean> {
    const { done } = await ollama.generate({
      model: this.modelId,
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
      model: this.modelId,
      messages,
      stream: true
    });
  }

  public responseFromChunks(chunks: string[]): LLMResponse {
    return { role: ChatMessageRoleEnum.assistant, content: chunks.join('') };
  }
}
