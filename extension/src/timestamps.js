export function formatTimestamp(timestamp) {
  if (timestamp === null || timestamp === undefined || timestamp === "") {
    return null;
  }

  if (typeof timestamp === "number") {
    if (!Number.isFinite(timestamp)) return null;

    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = Math.floor(timestamp % 60);
    const pad = (value) => String(value).padStart(2, "0");

    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;
  }

  const cleaned = String(timestamp).replace(/[[\]]/g, "").trim();

  if (!cleaned || cleaned.toLowerCase() === "null") return null;

  const timestampMatch = cleaned.match(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/);
  if (timestampMatch) return timestampMatch[1];

  const seconds = Number(cleaned);
  return Number.isFinite(seconds) ? formatTimestamp(seconds) : null;
}

export function getFallacyTimestamp(fallacy) {
  return formatTimestamp(
    fallacy?.timestamp ?? fallacy?.start ?? fallacy?.time ?? fallacy?.seconds
  );
}
