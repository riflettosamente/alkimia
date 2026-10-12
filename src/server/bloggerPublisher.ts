import { readDossier, saveDossierStep } from "./dossierTracker";

export const DEFAULT_ALKIMIA_BLOG_ID = "7470004339260692954"; // https://alkimiatoday.blogspot.com/

export interface BloggerPublishResult {
  published: boolean;
  skipped?: boolean;
  reason?: string;
  postId?: string;
  url?: string;
  title?: string;
  publishedAt?: string;
  error?: string;
}

function resolveBloggerCredentials() {
  const envRefresh = process.env.GOOGLE_REFRESH_TOKEN?.trim() || "";
  const normalizedRefresh =
    envRefresh && !envRefresh.startsWith("1//") && envRefresh.startsWith("04")
      ? `1//${envRefresh}`
      : envRefresh;

  return {
    clientId: process.env.GOOGLE_CLIENT_ID?.trim() || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || "",
    refreshToken: normalizedRefresh,
    blogId: process.env.BLOGGER_BLOG_ID?.trim() || DEFAULT_ALKIMIA_BLOG_ID
  };
}

export function isBloggerConfigured(): boolean {
  const { clientId, clientSecret, refreshToken } = resolveBloggerCredentials();
  return Boolean(clientId && clientSecret && refreshToken);
}

export function getBloggerConfigStatus() {
  const { clientId, clientSecret, refreshToken, blogId } = resolveBloggerCredentials();

  return {
    configured: Boolean(clientId && clientSecret && refreshToken),
    blogId,
    blogUrl: "https://alkimiatoday.blogspot.com/",
    hasClientId: Boolean(clientId),
    hasClientSecret: Boolean(clientSecret),
    hasRefreshToken: Boolean(refreshToken)
  };
}

async function getGoogleAccessToken(): Promise<string> {
  const { clientId, clientSecret, refreshToken } = resolveBloggerCredentials();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Credenziali Google Blogger mancanti (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)."
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token"
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    signal: AbortSignal.timeout(15000)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Impossibile ottenere Access Token da Google OAuth (${res.status}): ${errText}`);
  }

  const data: any = await res.json();
  if (!data.access_token) {
    throw new Error("Risposta OAuth Google priva di access_token.");
  }

  return data.access_token;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildBloggerPostHtml(essay: {
  title: string;
  subtitle?: string;
  ontologicalThesis?: string;
  narrativeParagraphs: string[];
}): string {
  const parts: string[] = [];

  if (essay.subtitle && essay.subtitle.trim()) {
    parts.push(
      `<p style="font-size: 1.15em; font-style: italic; color: #555555; margin-bottom: 1.5em; line-height: 1.6;">${escapeHtml(
        essay.subtitle.trim()
      )}</p>`
    );
  }

  if (essay.ontologicalThesis && essay.ontologicalThesis.trim()) {
    parts.push(
      `<blockquote style="border-left: 3px solid #8b7355; padding: 0.75em 1.25em; margin: 0 0 2em 0; background-color: #faf8f5; font-style: italic; color: #333333; line-height: 1.65;">` +
        `${escapeHtml(essay.ontologicalThesis.trim())}` +
        `</blockquote>`
    );
  }

  for (const paragraph of essay.narrativeParagraphs || []) {
    const cleanP = paragraph.trim();
    if (cleanP) {
      parts.push(
        `<p style="line-height: 1.8; margin-bottom: 1.4em; text-align: justify;">${escapeHtml(cleanP)}</p>`
      );
    }
  }

  return parts.join("\n\n");
}

function extractCleanLabels(vectorA?: string, vectorB?: string): string[] {
  const cleanLabel = (v?: string) =>
    v
      ? v
          .replace(/^\d+\.\s*/, "")
          .replace(/\s*\(.*?\)\s*/g, "")
          .trim()
          .slice(0, 45)
      : "";

  const labels = ["Saggio del Giorno"];
  const lA = cleanLabel(vectorA);
  const lB = cleanLabel(vectorB);
  if (lA) labels.push(lA);
  if (lB && lB !== lA) labels.push(lB);
  return labels;
}

/**
 * Pubblica automaticamente il Saggio del Giorno su Blogger (alkimiatoday.blogspot.com).
 * Se per quella data solare il post risulta già pubblicato nel dossier e `force` è false,
 * evita duplicati restituendo il riferimento esistente.
 */
export async function publishDailyEssayToBlogger(
  solarDateKey: string,
  essay: {
    title: string;
    subtitle?: string;
    ontologicalThesis?: string;
    narrativeParagraphs: string[];
  },
  options?: {
    vectorA?: string;
    vectorB?: string;
    force?: boolean;
    isDraft?: boolean;
  }
): Promise<BloggerPublishResult> {
  try {
    if (!isBloggerConfigured()) {
      return {
        published: false,
        skipped: true,
        reason: "Credenziali Blogger OAuth non ancora configurate nell'ambiente."
      };
    }

    const existingDossier = readDossier(solarDateKey);
    if (!options?.force && existingDossier?.bloggerPost?.postId && existingDossier?.bloggerPost?.url) {
      console.log(
        `[Blogger] Saggio del ${solarDateKey} già pubblicato su Blogger (${existingDossier.bloggerPost.url}). Salto duplicato.`
      );
      return {
        published: true,
        skipped: true,
        reason: "Già pubblicato per questa data solare.",
        postId: existingDossier.bloggerPost.postId,
        url: existingDossier.bloggerPost.url,
        title: existingDossier.bloggerPost.title,
        publishedAt: existingDossier.bloggerPost.publishedAt
      };
    }

    if (!essay || !essay.title || !Array.isArray(essay.narrativeParagraphs) || essay.narrativeParagraphs.length === 0) {
      return {
        published: false,
        error: "Saggio incompleto o privo di paragrafi narrativi."
      };
    }

    const blogId = process.env.BLOGGER_BLOG_ID?.trim() || DEFAULT_ALKIMIA_BLOG_ID;
    const accessToken = await getGoogleAccessToken();
    const htmlContent = buildBloggerPostHtml(essay);
    const labels = extractCleanLabels(
      options?.vectorA || existingDossier?.fullEdition?.systemPair?.vectorA,
      options?.vectorB || existingDossier?.fullEdition?.systemPair?.vectorB
    );

    const endpoint = new URL(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`);
    if (options?.isDraft) {
      endpoint.searchParams.set("isDraft", "true");
    }

    console.log(`[Blogger] Pubblicazione automatica in corso su blog ${blogId}: «${essay.title}»...`);

    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: "blogger#post",
        blog: { id: blogId },
        title: essay.title.trim(),
        content: htmlContent,
        labels
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Blogger API error (${response.status}): ${errBody}`);
    }

    const postData: any = await response.json();
    const record = {
      postId: String(postData.id || ""),
      url: String(postData.url || "https://alkimiatoday.blogspot.com/"),
      title: String(postData.title || essay.title),
      publishedAt: new Date().toISOString(),
      solarDateKey
    };

    saveDossierStep(solarDateKey, "bloggerPost", record);
    console.log(`[Blogger] ✅ Saggio pubblicato con successo su Blogger: ${record.url}`);

    return {
      published: true,
      postId: record.postId,
      url: record.url,
      title: record.title,
      publishedAt: record.publishedAt
    };
  } catch (err: any) {
    console.error(`[Blogger] ❌ Errore pubblicazione su Blogger per ${solarDateKey}:`, err.message || err);
    return {
      published: false,
      error: err.message || String(err)
    };
  }
}
