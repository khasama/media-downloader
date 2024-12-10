import fs from 'fs';
import path from "path";
import { downloadMedia, getDouyinMediaSource, getIxiguaMediaSource } from './utils.js';

export async function ixiguaDownloader(url, dir, callback) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const match = url.match(/\/(\d+)(?:\?|$)/);
  const id = match ? match[1] : Date.now();
  try {
    const mediaSource = await getIxiguaMediaSource(url);
    if (!mediaSource.video) {
      throw new Error('Media source not found!');
    }
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
  } catch (error) {
    throw error;
  }
}

export async function douyinDownloader(url, dir, callback) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  try {
    const match = url.match(/https:\/\/www\.douyin\.com\/video\/(\d+)/);
    const id = match ? match[1] : Date.now();
    const mediaSource = await getDouyinMediaSource(url);
    if (!mediaSource) {
      throw new Error('Media source not found!');
    }
    await downloadMedia(mediaSource, path.join(
      dir,
      `${id}.mp4`
    ), 'https://www.douyin.com/', callback);
  } catch (error) {
    throw error;
  }
}