**Installation:**

Install the library using npm:

```bash
npm install @khasama/media-downloader
```

**Usage:**

1. Import the required function:

   ```javascript
   import { ixiguaDownloader } from "@khasama/media-downloader";
   ```

2. Call the `ixiguaDownloader` function with the following arguments:

   - `url`: The URL of the Ixigua video you want to download (string).
   - `dir`: The directory where you want to save the downloaded video (string). This directory will be created if it doesn't exist.
   - `callback` ({ process, filename, err }): callback function.

**Example:**

```javascript
import { ixiguaDownloader } from "@khasama/media-downloader";
const videoUrl = "https://www.ixigua.com/7161999829802209795/";
const downloadDir = "./downloads";

ixiguaDownloader(videoUrl, downloadDir, ({ err }) => {
  if (err) {
    console.error("Error downloading video:", err);
  } else {
    console.log("Video downloaded successfully!");
  }
});
```
