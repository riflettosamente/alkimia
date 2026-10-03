/**
 * Servizio di Ricerca Web a Costo Zero (Zero Token Gemini).
 * Esegue ricerche in tempo reale su Wikipedia REST API e fonti aperte
 * per raccogliere dati concreti, opere, scienziati, testimoni e strumenti
 * da fornire a Groq per la compilazione della Fase 1.5.
 */

interface WebSearchResultItem {
  title: string;
  snippet: string;
  source: string;
}

export interface TopicWebContext {
  topic: string;
  results: WebSearchResultItem[];
  combinedContext: string;
}

/**
 * Pulisce il nome del topic per la ricerca web, rimuovendo prefissi numerici o generici.
 */
function cleanTopicQuery(rawTopic: string): string {
  return rawTopic
    .replace(/^\d+\.\s*/i, '')
    .replace(/^La\s+|Il\s+|Gli\s+|I\s+|Le\s+|L'/i, '')
    .trim();
}

/**
 * Cerca su Wikipedia in lingua italiana (con fallback in lingua inglese se pochi risultati).
 */
async function searchWikipedia(query: string, lang: 'it' | 'en' = 'it'): Promise<WebSearchResultItem[]> {
  try {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=6&format=json&utf8=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AlkimiaInvestigativeEngine/1.0 (https://alkimia.studio; research@alkimia.studio)'
      }
    });

    if (!res.ok) return [];
    const data: any = await res.json();
    const searchResults = data?.query?.search || [];

    return searchResults.map((item: any) => ({
      title: item.title,
      snippet: (item.snippet || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
      source: `Wikipedia (${lang.toUpperCase()}): ${item.title}`
    }));
  } catch (err) {
    console.warn(`[WebSearchService] Errore ricerca Wikipedia (${lang}) per "${query}":`, err);
    return [];
  }
}

/**
 * Esegue la ricerca web completa per un argomento specifico, combinando le query principali.
 */
export async function fetchTopicWebContext(rawTopicName: string): Promise<TopicWebContext> {
  const cleanName = cleanTopicQuery(rawTopicName);
  console.log(`[WebSearchService] Avvio ricerca web live a zero token per: «${cleanName}»...`);

  // Esegui ricerche parallele: nome pulito, + libri/scienziati, + evidenze
  const [resultsGeneral, resultsSpecific] = await Promise.all([
    searchWikipedia(cleanName, 'it'),
    searchWikipedia(`${cleanName} esperimenti scienziati libri`, 'it')
  ]);

  // Unifica e deduplica per titolo
  const seenTitles = new Set<string>();
  const combined: WebSearchResultItem[] = [];

  for (const item of [...resultsGeneral, ...resultsSpecific]) {
    if (!seenTitles.has(item.title.toLowerCase())) {
      seenTitles.add(item.title.toLowerCase());
      combined.push(item);
    }
  }

  // Se i risultati in italiano sono meno di 2, effettua un rapido fallback in inglese
  if (combined.length < 2) {
    const enResults = await searchWikipedia(cleanName, 'en');
    for (const item of enResults) {
      if (!seenTitles.has(item.title.toLowerCase())) {
        seenTitles.add(item.title.toLowerCase());
        combined.push(item);
      }
    }
  }

  const combinedContext = combined
    .slice(0, 4)
    .map((item, idx) => `[Fonte ${idx + 1}: ${item.title}] ${item.snippet.slice(0, 220)}`)
    .join('\n\n');

  console.log(`[WebSearchService] Trovate ${combined.length} fonti web live per «${cleanName}» (sintetizzate ${Math.min(4, combined.length)} fonti essenziali).`);

  return {
    topic: rawTopicName,
    results: combined,
    combinedContext: combinedContext || `Nessun risultato web esplicito trovato per ${cleanName}.`
  };
}
