import '@std/dotenv/load';
export const MODEL_ID = Deno.env.get('MODEL_ID') || '';
