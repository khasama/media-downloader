import fs from 'fs';
import path from "path";
import { downloadMedia, getIxiguaMediaSource } from './utils.js';

export async function ixiguaDownloader(url, dir, callback) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const match = url.match(/\/(\d+)(?:\?|$)/);
  const id = match ? match[1] : null;
  const mediaSource = await getIxiguaMediaSource(url);
  if (mediaSource.audio) {
    await downloadMedia(mediaSource.audio, path.join(
      dir,
      `${id}.mp3`
    ), 'https://www.ixigua.com/', callback);
  }
  await downloadMedia(mediaSource.video, path.join(
    dir,
    `${id}.mp4`
  ), 'https://www.ixigua.com/', callback);
}