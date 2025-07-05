import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

const TOPIC_PATH = path.join(process.cwd(), 'src/topics/topics.txt');

export async function getNextTopic(): Promise<string | null> { 
  console.log('fs readFile:', readFile);
  console.log('fs writeFile:', writeFile);
  console.log('TOPIC_PATH:', TOPIC_PATH);
  
  const content = await readFile(TOPIC_PATH, 'utf8');
  const topics = content.split('\n').map(t => t.trim()).filter(Boolean);
  if (topics.length === 0) return null;
  const topic = topics[0];
  await writeFile(TOPIC_PATH, topics.slice(1).join('\n'));
  return topic;
}