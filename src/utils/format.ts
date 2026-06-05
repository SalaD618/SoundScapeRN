export function formatNumber(value: string | number): string {
  const n = Number(value || 0);

  if (!Number.isFinite(n)) return String(value || "0");
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;

  return String(Math.round(n));
}

export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

export function isPlaceholderImage(url?: string): boolean {
  return !url || url.includes("2a96cbd8b46e442fc41c2b86b821562f");
}
