import { env } from 'cloudflare:workers';
export async function GET(){return Response.json({ready:!!(env as unknown as Record<string,string>).OPENAI_API_KEY},{headers:{'Cache-Control':'no-store'}});}
