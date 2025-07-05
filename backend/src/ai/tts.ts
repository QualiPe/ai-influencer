import fetch from 'node-fetch';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';
dotenv.config();

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY!;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';

export async function generateTTS(text: string, outFile: string) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVEN_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.7 }
    })
  });
  if (!res.ok) throw new Error('TTS error: ' + await res.text());
  const buf = await res.arrayBuffer();
  await fs.writeFile(outFile, Buffer.from(buf));
}