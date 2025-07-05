import * as ffmpegImport from 'fluent-ffmpeg';
const ffmpeg: any = ffmpegImport;

export async function mergeAV(
  videoPath: string,
  audioPath: string,
  outPath: string,
  subtitlesPath?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(videoPath)
      .addInput(audioPath)
      .outputOptions('-shortest')

    if (subtitlesPath) {
      command = command.outputOptions([
        `-vf subtitles=${subtitlesPath}`
      ]);
    }

    command
      .on('end', () => resolve())
      .on('error', (err: any) => reject(err))
      .save(outPath);
  });
}