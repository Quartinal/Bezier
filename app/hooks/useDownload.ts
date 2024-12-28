import { useState, useEffect } from "react";
import { useBrowserStore } from "~/store/browserStore";

interface DownloadProgress {
  bytesReceived: number;
  totalBytes: number;
  percent: number;
  speed: number;
  timeRemaining: number;
}

export function useDownload(url: string, filename: string) {
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { startDownload, updateDownload } = useBrowserStore();

  useEffect(() => {
    const startTime = Date.now();
    let downloadId: string;

    const controller = new AbortController();
    const { signal } = controller;

    const startDownloadProcess = async () => {
      try {
        const response = await fetch(url, { signal });
        const contentLength = response?.headers?.get("content-length");
        const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

        downloadId = crypto.randomUUID();
        startDownload(url, filename);

        const reader = response?.body?.getReader();
        let receivedBytes = 0;

        let done = false;
        while (!done) {
          const { done: readerDone, value } = await reader!.read();
          done = readerDone;

          if (done) {
            break;
          }

          receivedBytes += value!.length;
          const elapsedTime = (Date.now() - startTime) / 1000;
          const speed = receivedBytes / elapsedTime;
          const timeRemaining = (totalBytes - receivedBytes) / speed;

          const currentProgress = {
            bytesReceived: receivedBytes,
            totalBytes,
            percent: (receivedBytes / totalBytes) * 100,
            speed,
            timeRemaining,
          };

          setProgress(currentProgress);
          updateDownload(downloadId, {
            progress: currentProgress.percent,
            speed: currentProgress.speed,
            timeRemaining: currentProgress.timeRemaining,
            downloadedSize: currentProgress.bytesReceived,
          });
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err as Error);
        if (downloadId) {
          updateDownload(downloadId, { status: "error" });
        }
      }
    };

    startDownloadProcess();

    return () => {
      controller.abort();
    };
  }, [url, filename, startDownload, updateDownload]);

  return { progress, error };
}
