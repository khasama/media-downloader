import axios from "axios";
import fs from 'fs';
import puppeteer from 'puppeteer';

export async function downloadMedia(url, outputPath, referer, callback) {
  const writer = fs.createWriteStream(outputPath);
  const fileName = outputPath.split("\\").pop();
  const headers = {};
  if (referer) {
    headers['Referer'] = referer;
  }

  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      headers,
    });

    const totalLength = parseInt(response.headers["content-length"], 10);
    let downloadedLength = 0;

    response.data.on("data", (chunk) => {
      downloadedLength += chunk.length;
      if (!isNaN(totalLength)) {
        const percentage = ((downloadedLength / totalLength) * 100).toFixed(2);
        if (callback) {
          callback({
            fileName,
            process: percentage
          });
        }
      } else {
        if (callback) {
          callback({
            fileName,
            process: "unknown"
          });
        }
      }
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        if (callback) {
          callback({
            fileName,
            process: 100
          });
        }
        resolve();
      });
      writer.on("error", (error) => {
        console.error("\nError writing to file:", error);
        if (callback) {
          callback({
            fileName,
            process: "error",
            err: error
          });
        }
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error downloading media:", error);
    if (callback) {
      callback({
        fileName,
        process: "error",
        err: error
      });
    }
  }
}

export async function getIxiguaMediaSource(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const mediaSource = {
    video: null,
    audio: null
  }
  page.on("request", async (request) => {
    const requestUrl = request.url();

    if (requestUrl.includes("v3-prime-xg-web-pc.ixigua.com/video/tos/cn")) {
      if (requestUrl.includes("media-audio")) {
        mediaSource.audio = requestUrl;
      } else if (requestUrl.includes("media-video")) {
        mediaSource.video = requestUrl;
      } else {
        mediaSource.video = requestUrl;
      }
    }

  });

  try {
    await page.goto(url, { waitUntil: "networkidle2" });
  } catch (error) {
    console.error(error);
    await browser.close();
    throw error;
  }
  await browser.close();
  return mediaSource;
}

export async function getDouyinMediaSource(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.xg-video-container');

    const videoSrc = await page.evaluate(() => {
      const container = document.querySelector('.xg-video-container');
      if (!container) return null;

      const video = container.querySelector('video');
      if (!video) return null;

      const sources = video.querySelectorAll('source');
      if (!sources.length) return null;

      return sources[sources.length - 1].src;
    });

    if (!videoSrc) {
      await browser.close();
      return;
    }
    await browser.close();
    return videoSrc;

  } catch (error) {
    console.error(error);
    await browser.close();
    throw error;
  }
}

export async function getVideofkMediaSource(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.videofk.com/search?url=${url}`, { waitUntil: 'networkidle2' });

    await page.waitForSelector('div.video-files', { timeout: 10000 });

    const result = await page.evaluate(() => {
      const videoFilesDiv = document.querySelector('div.video-files');
      if (!videoFilesDiv) return null;

      const links = Array.from(videoFilesDiv.querySelectorAll('a[target="_blank"]'));
      const hrefs = links.map(link => link.href);

      const processedHrefs = hrefs.map(href => {
        const parts = href.split('url=');
        return parts.length > 1 ? parts[parts.length - 1] : null;
      }).filter(Boolean); // Remove null or undefined values

      return processedHrefs.length > 0 ? processedHrefs[processedHrefs.length - 1] : null;
    });
    await browser.close();
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    await browser.close();
  }
}

export async function getVideofkDownloadSource(url) {
  const response = await axios({
    url: `https://downloader.twdown.online/load_url`,
    method: "GET",
    params: {
      url
    },
    responseType: 'text'
  });
  return response.data;
}