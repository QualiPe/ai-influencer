import * as path from 'path';
import { getNextTopic } from './topics/utils';
import { generatePrompt, generateTTS } from './ai/gpt';
import { generateVideo } from './ai/luma';
import { generateTTS as synthTTS } from './ai/tts';
import { mergeAV } from './media/merge';
import * as dotenv from 'dotenv';
dotenv.config();
import { launchBot } from './bot/telegram';
launchBot();

export async function main() {
  const topic = await getNextTopic();
  if (!topic) {
    console.log('Нет тем для генерации.');
    return;
  }
  console.log('Генерируем по теме:', topic);

  const prompt = await generatePrompt(topic);
  console.log('GPT prompt:', prompt);

  const vidPath = path.resolve('shared', `${topic.replace(/[^a-z0-9]/gi, '_')}.mp4`);
  await generateVideo(prompt, vidPath);

  const ttsText = await generateTTS(prompt);

  const ttsPath = path.resolve('shared', `${topic.replace(/[^a-z0-9]/gi, '_')}.wav`);
  await synthTTS(ttsText, ttsPath);

  const outFile = path.resolve('shared', `${topic.replace(/[^a-z0-9]/gi, '_')}_final.mp4`);
  await mergeAV(vidPath, ttsPath, outFile);

  console.log('Completed:', outFile);
  return outFile;
}