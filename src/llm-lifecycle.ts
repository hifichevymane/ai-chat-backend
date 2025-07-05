import { LLMService } from './services';

const MODEL_ID = process.env.MODEL_ID;
const llmService = new LLMService(MODEL_ID);

export const loadLLM = async (): Promise<void> => {
  console.log(`Loading LLM model "${MODEL_ID}"...`);
  const isLoaded = await llmService.loadModel();
  if (!isLoaded) {
    throw new Error(`Error while loading LLM model "${MODEL_ID}"`);
  }

  console.log(`LLM model "${MODEL_ID}" loaded successfully!`);
};

export const unloadLLM = async (): Promise<void> => {
  const isUnloaded = await llmService.unloadModel();
  if (isUnloaded) {
    console.log('LLM model has been unloaded successfully!');
  }
};
