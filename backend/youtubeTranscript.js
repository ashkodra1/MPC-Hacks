import { YoutubeTranscript } from "youtube-transcript";

export function extractVideoId(url) {
  const regex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/;

  const match = url.match(regex);

  if (!match) {
    throw new Error("Invalid YouTube URL");
  }

  return match[1];
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (value) => String(value).padStart(2, "0");

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  return `${pad(mins)}:${pad(secs)}`;
}

export async function getYoutubeTranscript(url) {
  const videoId = extractVideoId(url);

  const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

  const transcript = transcriptItems
    .map((item) => `[${formatTime(item.start)}] ${item.text}`)
    .join(" ");

  return {
    videoId,
    transcript
  };
}