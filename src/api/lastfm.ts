import type { Artist, ArtistDetails } from "../types";
import { isPlaceholderImage, stripHtml } from "../utils/format";

const BASE_URL = "https://ws.audioscrobbler.com/2.0/";
const API_KEY = process.env.EXPO_PUBLIC_LASTFM_API_KEY || "";

type LastFmImageDto = {
  "#text"?: string;
  size?: string;
};

type LastFmArtistDto = {
  name?: string;
  listeners?: string;
  playcount?: string;
  url?: string;
  image?: LastFmImageDto[];
  stats?: {
    listeners?: string;
    playcount?: string;
  };
  bio?: {
    summary?: string;
    content?: string;
  };
  tags?: {
    tag?: Array<{ name?: string }>;
  };
};

function requireApiKey(): void {
  if (!API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_LASTFM_API_KEY. Create .env from .env.example.");
  }
}

async function request<T>(params: Record<string, string>): Promise<T> {
  requireApiKey();

  const query = new URLSearchParams({
    ...params,
    api_key: API_KEY,
    format: "json"
  });

  const response = await fetch(`${BASE_URL}?${query.toString()}`);
  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.message || "Last.fm request failed");
  }

  return data as T;
}

function bestImage(images?: LastFmImageDto[]): string {
  const found = [...(images || [])]
    .reverse()
    .find((image) => image["#text"] && !isPlaceholderImage(image["#text"]));

  return found?.["#text"] || "";
}

function mapArtist(dto: LastFmArtistDto): Artist {
  return {
    name: dto.name || "Unknown artist",
    listeners: String(dto.listeners || "0"),
    playcount: String(dto.playcount || "0"),
    imageUrl: bestImage(dto.image),
    url: dto.url || ""
  };
}

export async function getTopArtists(limit = 10): Promise<Artist[]> {
  const data = await request<{ artists?: { artist?: LastFmArtistDto[] } }>({
    method: "chart.gettopartists",
    limit: String(limit)
  });

  return (data.artists?.artist || []).map(mapArtist);
}

export async function getTopArtistsByGenre(genre: string, limit = 10): Promise<Artist[]> {
  if (!genre.trim() || genre === "All") {
    return getTopArtists(limit);
  }

  const data = await request<{ topartists?: { artist?: LastFmArtistDto[] } }>({
    method: "tag.gettopartists",
    tag: genre.toLowerCase(),
    limit: String(limit)
  });

  return (data.topartists?.artist || []).map(mapArtist);
}

export async function searchArtists(query: string, limit = 10): Promise<Artist[]> {
  if (!query.trim()) return [];

  const data = await request<{
    results?: { artistmatches?: { artist?: LastFmArtistDto[] } };
  }>({
    method: "artist.search",
    artist: query,
    limit: String(limit)
  });

  return (data.results?.artistmatches?.artist || []).map(mapArtist);
}

export async function getArtistDetails(artistName: string): Promise<ArtistDetails> {
  const data = await request<{ artist?: LastFmArtistDto }>({
    method: "artist.getinfo",
    artist: artistName
  });

  const artist = data.artist || {};

  return {
    name: artist.name || artistName,
    listeners: String(artist.stats?.listeners || artist.listeners || "0"),
    playcount: String(artist.stats?.playcount || artist.playcount || "0"),
    imageUrl: bestImage(artist.image),
    summary: stripHtml(artist.bio?.summary || artist.bio?.content || ""),
    tags: (artist.tags?.tag || []).map((tag) => tag.name).filter(Boolean) as string[],
    url: artist.url || ""
  };
}

export async function getSimilarArtists(artistName: string, limit = 5): Promise<Artist[]> {
  const data = await request<{ similarartists?: { artist?: LastFmArtistDto[] } }>({
    method: "artist.getsimilar",
    artist: artistName,
    limit: String(limit)
  });

  return (data.similarartists?.artist || []).map(mapArtist);
}
