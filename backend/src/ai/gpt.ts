import { readFile } from 'fs/promises';
import fetch from 'node-fetch';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function generatePrompt(topic: string): Promise<string> {
  const memoryPath = path.join(__dirname, '../config/prompt_memory.txt');
  const memory = await readFile(memoryPath, 'utf8');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [{
        role: 'system',
        content: memory
      }, {
        role: 'user',
        content: `Topic: ${topic}`
      }]
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const j = await res.json() as any;
  return j.choices[0].message.content.trim();
}

export async function generateTTS(text: string): Promise<string> {
  const memoryPath = path.join(__dirname, '../config/tts_memory.txt');
  const memory = await readFile(memoryPath, 'utf8');
  return `${memory}\n\n${text}`;
}