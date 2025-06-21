declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    APP_PORT: string;
    FRONTEND_ALLOWED_URL: string;
    MODEL_ID: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    DB_DATABASE: string;
    OLLAMA_HOST: string;
    OLLAMA_PORT: string;
  }
}
