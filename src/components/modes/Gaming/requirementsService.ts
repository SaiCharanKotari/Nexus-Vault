// Simplified requirements service that cleans Steam's HTML and returns raw text.

export interface ParsedRequirements {
  minimum: string | null;
  recommended: string | null;
  screenshots: string[];
  movies: {
    id: number;
    name: string;
    thumbnail: string;
    mp4: string;
    webm: string;
  }[];
}

const ensureHttps = (url: string) => {
  if (!url) return "";
  return url.replace(/^http:/i, "https:");
};

function cleanRequirements(html: string | undefined): string | null {
  if (!html) return null;

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#160;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Simple in-memory cache keyed by appid
const cache: Record<number, ParsedRequirements> = {};
export async function fetchRequirements(
  appId: number
): Promise<ParsedRequirements> {
  if (cache[appId]) return cache[appId];

  try {
    // Use Electron IPC to bypass CORS
    const { ipcRenderer } = (window as any).require("electron");
    const json = await ipcRenderer.invoke(
      "fetch-steam-data",
      `https://store.steampowered.com/api/appdetails?appids=${appId}&filters=basic,screenshots,movies`
    );

    const appData = json?.[String(appId)];

    if (!appData?.success) {
      throw new Error("Steam returned unsuccessful response");
    }

    const data = appData?.data;
    const pcReq = data?.pc_requirements;

    const result: ParsedRequirements = {
      minimum: cleanRequirements(pcReq?.minimum),
      recommended: cleanRequirements(pcReq?.recommended),
      screenshots:
        data?.screenshots?.map((s: any) => s.path_full) || [],
      movies:
        data?.movies?.map((m: any) => ({
          id: m.id,
          name: m.name,
          thumbnail: ensureHttps(m.thumbnail),
          mp4: ensureHttps(m.mp4?.max || m.mp4?.["480"] || ""),
          webm: ensureHttps(m.webm?.max || m.webm?.["480"] || ""),
        })) || [],
    };

    cache[appId] = result;

    return result;
  } catch (err) {
    console.error(
      `[requirementsService] Failed to fetch for appId ${appId}:`,
      err
    );

    const empty: ParsedRequirements = {
      minimum: null,
      recommended: null,
      screenshots: [],
      movies: [],
    };

    cache[appId] = empty;

    return empty;
  }
}

// ── Nexus Library API ────────────────────────────────────────────────────────

const NEXUS_SERVER = 'http://localhost:5000';

/** Fetch list of Steam IDs from the Nexus server for a given category */
export async function fetchLibraryIds(category: 'online' | 'protected'): Promise<number[]> {
  try {
    const res = await fetch(`${NEXUS_SERVER}/api/games/${category}`, {
      cache: 'no-store', // Prevent Electron from serving stale cache when server is down
    });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const data = await res.json();
    return data.steamIds || [];
  } catch (err) {
    console.error(`[library] Failed to fetch ${category} IDs from server:`, err);
    return [];
  }
}

/** Fetch basic Steam info (title, banner, logo, etc.) for a single app ID */
export async function fetchSteamBasicInfo(appId: number): Promise<any | null> {
  try {
    const { ipcRenderer } = (window as any).require('electron');
    const json = await ipcRenderer.invoke(
      'fetch-steam-data',
      `https://store.steampowered.com/api/appdetails?appids=${appId}&filters=basic,screenshots,movies`
    );
    const appData = json?.[String(appId)];
    if (!appData?.success) return null;
    const d = appData.data;
    return {
      id: appId,
      title: d.name,
      developer: d.developers?.[0] || '',
      description: d.short_description || '',
      rating: 'N/A',
      releaseDate: d.release_date?.date || '',
      image: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900.jpg`,
      banner: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/library_hero.jpg`,
      logo: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/logo.png`,
      screenshots: d.screenshots?.map((s: any) => s.path_full) || [],
      movies: d.movies?.map((m: any) => ({
        id: m.id,
        name: m.name,
        thumbnail: ensureHttps(m.thumbnail),
        url: ensureHttps(m.mp4?.max || m.mp4?.['480'] || ''),
      })) || [],
    };
  } catch (err) {
    console.error(`[library] Failed to fetch Steam info for ${appId}:`, err);
    return null;
  }
}