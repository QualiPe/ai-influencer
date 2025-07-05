import fetch from 'node-fetch';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
dotenv.config();

const LUMA_API_KEY = process.env.LUMA_API_KEY!;

export async function generateVideo(prompt: string, outFile: string) {
  const url = 'https://api.lumalabs.ai/dream-machine/v1/generations';
  const headers = {
    'Authorization': `Bearer ${LUMA_API_KEY}`,
    'Content-Type': 'application/json'
  };
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt,
      model: 'ray-2',
      resolution: '540p',
      duration: '9s',
      aspect_ratio: '9:16'
    })
  });
  if (!res.ok) throw new Error('Luma error: ' + await res.text());
  const { id } = await res.json() as { id: string };

  for (let tries = 0; tries < 60; tries++) {
    await new Promise(r => setTimeout(r, 3000));
    const statusRes = await fetch(`${url}/${id}`, { headers });
    const status = await statusRes.json() as { state: string; assets?: { video: string } };
    if (status.state === 'completed' && status.assets?.video) {
      const vidBuf = await fetch(status.assets.video).then(r => r.arrayBuffer());
      await fs.writeFile(outFile, Buffer.from(vidBuf));
      return outFile;
    }
    if (status.state === 'failed') throw new Error('Luma job failed');
  }
  throw new Error('Timeout waiting for video');
}