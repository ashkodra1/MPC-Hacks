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

export async function getYoutubeTranscript(url) {
  const videoId = extractVideoId(url);

  const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

  const transcript = transcriptItems
    .map((item) => item.text)
    .join(" ");

  return {
    videoId,
    transcript
  };
}