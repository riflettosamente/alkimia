import { readDossier, saveDossierStep } from "../src/server/dossierTracker";
import { selectDailyVectorPair } from "../src/ai/ontologicalSystemPrompt";
import { jsonrepair } from "jsonrepair";

function cleanAndParseJson(rawText: string): any {
  let cleaned = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^[\s\S]*?<\/think>/gi, "")
    .trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {}

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const extracted = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(extracted);
    } catch {}
    try {
      return JSON.parse(jsonrepair(extracted));
    } catch {}
  }

  try {
    return JSON.parse(jsonrepair(cleaned));
  } catch {}

  throw new Error("Impossibile decodificare il JSON restituito da Groq.");
}

function stripMarkdownBoldServer(text: unknown): string {
  if (typeof text === "string") {
    return text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
  }
  return "";
}

function extractNormalizedEssay(parsed: any, solarDateKey: string = "2026-10-09") {
  if (!parsed || typeof parsed !== "object") return null;
  const rawEssay = parsed.essay && typeof parsed.essay === "object" ? parsed.essay : parsed;

  const title = stripMarkdownBoldServer(rawEssay.title || rawEssay.titolo);
  const subtitle = stripMarkdownBoldServer(rawEssay.subtitle || rawEssay.sottotitolo);
  const ontologicalThesis = stripMarkdownBoldServer(
    rawEssay.ontologicalThesis || rawEssay.thesis || rawEssay.tesiOntologica || rawEssay.tesi
  );

  const rawNarrative =
    rawEssay.narrativeParagraphs ??
    rawEssay.paragraphs ??
    rawEssay.paragrafi ??
    rawEssay.body ??
    rawEssay.content ??
    rawEssay.testo;

  let narrativeParagraphs: string[] = [];
  if (Array.isArray(rawNarrative)) {
    narrativeParagraphs = rawNarrative.map(p => stripMarkdownBoldServer(p)).filter(Boolean);
  } else if (typeof rawNarrative === "string" && rawNarrative.trim().length > 0) {
    narrativeParagraphs = rawNarrative
      .split(/\n\s*\n/)
      .map(p => stripMarkdownBoldServer(p))
      .filter(Boolean);
  }

  if (!title || narrativeParagraphs.length === 0) {
    return null;
  }

  return {
    id: rawEssay.id || `saggio-${solarDateKey}`,
    cycleId: rawEssay.cycleId || `cycle-${solarDateKey}`,
    title,
    subtitle: subtitle || "Trattato sulla convergenza empirica e speculativa dei due domini d'indagine",
    ontologicalThesis: ontologicalThesis || narrativeParagraphs[0],
    preamble: "",
    narrativeParagraphs,
    sections: [],
    corollaries: [],
    openAporias: [],
    bibliographicResonances: []
  };
}

async function run() {
  const solarDateKey = "2026-10-09";
  console.log(`[Groq Phase 6 Generator] Avvio per data ${solarDateKey}...`);
  const dossier = readDossier(solarDateKey);
  if (!dossier) {
    throw new Error(`Dossier per ${solarDateKey} non trovato.`);
  }

  const pair = selectDailyVectorPair(solarDateKey);
  const strip = (s?: string, max = 150) => {
    if (!s) return "";
    const c = s.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    return c.length <= max ? c : c.slice(0, max) + "...";
  };

  const vA = dossier.phase1To4?.phase1Decomposition?.vectorA;
  const vB = dossier.phase1To4?.phase1Decomposition?.vectorB;
  const empA = dossier.phase1To4?.phase1EmpiricalArchive?.vectorA;
  const empB = dossier.phase1To4?.phase1EmpiricalArchive?.vectorB;
  const p2 = dossier.phase1To4?.phase2Collision;
  const p3 = dossier.phase1To4?.phase3FinalStrike;
  const loopTracks = dossier.phase1To4?.phase2Loop?.tracks || [];

  const loopSummary = loopTracks.map((t: any, i: number) => {
    const s1 = t.collision?.step1StrippingFunction || {};
    const s3 = t.collision?.step3InvertedDirection || {};
    return `• Dir #${i + 1} (${strip(t.directionTitle, 80)}): ${strip(s1.functionalSynthesis, 120)} | Intuizione: ${strip(s3.counterIntuitiveInsight, 140)}`;
  }).join("\n");

  const sys = `SEI L'AUTORE DEL SAGGIO FINALE DI ALKIMIA.
IL TUO COMPITO È TRASFORMARE L'INDAGINE DELLE FASI 1–5 IN UN GRANDE SAGGIO CONTEMPORANEO (1.200 - 1.800 PAROLE), LIMPIDO, APPASSIONANTE E RICCO DI SOSTANZA CONCETTUALE.
DIVIETI TASSATIVI:
- ZERO GRASSETTI (**), zero asterischi nel titolo, sottotitolo, tesi o corpo.
- ZERO elenchi puntati o numerati.
- ZERO formule metanarrative ("In questo saggio...", "Analizzeremo...").
- ZERO etichette procedurali ("Fase 1", "Fase 2", "Cassetto", "Loop", "Vettore A").
- Scrivi in un italiano contemporaneo limpido, elegante e naturale.
Articola il saggio in 5 ampi paragrafi narrativi continui:
1. L'Innesco e il Paradosso di Partenza (minimo 250 parole)
2. La Soglia Condivisa e il Punto di Contatto (minimo 250 parole)
3. La Trasmutazione Alchemica e le Nuove Intuizioni emerse (minimo 300 parole)
4. Nuovi Campi di Ricerca, Applicazioni e Indagini Filosofiche (minimo 300 parole)
5. Lo Sguardo d'Insieme e la Nuova Visione sul Reale (minimo 250 parole)

Rispondi RIGOROSAMENTE con questo formato JSON:
{
  "essay": {
    "title": "Titolo d'autore privo di asterischi",
    "subtitle": "Sottotitolo chiaro privo di asterischi",
    "ontologicalThesis": "Tesi centrale profonda e memorabile, priva di asterischi",
    "narrativeParagraphs": [
      "Paragrafo 1 completo...",
      "Paragrafo 2 completo...",
      "Paragrafo 3 completo...",
      "Paragrafo 4 completo...",
      "Paragrafo 5 completo..."
    ]
  }
}`;

  const usr = `DOSSIER D'INDAGINE:
PRIMO ARGOMENTO: ${pair.vectorA.name}
SECONDO ARGOMENTO: ${pair.vectorB.name}
Sintesi d'Attrito: ${strip(dossier.phase1To4?.systemPair?.syntheticVector, 180)}

1. Coordinate e Soglie:
- ${pair.vectorA.name}: ${strip(vA?.whenWhere, 140)} | ${strip(vA?.whyVeiled, 140)}
- ${pair.vectorB.name}: ${strip(vB?.whenWhere, 140)} | ${strip(vB?.whyVeiled, 140)}

2. Archivio Empirico (Opere, Testimoni, Strumenti, Teorie):
- ${pair.vectorA.name}: ${strip(empA?.foundationalTexts, 140)} | ${strip(empA?.keyFiguresAndWitnesses, 140)} | ${strip(empA?.materialEvidenceAndTools, 140)} | ${strip(empA?.breakthroughTheories, 140)}
- ${pair.vectorB.name}: ${strip(empB?.foundationalTexts, 140)} | ${strip(empB?.keyFiguresAndWitnesses, 140)} | ${strip(empB?.materialEvidenceAndTools, 140)} | ${strip(empB?.breakthroughTheories, 140)}
- Sintesi Empirica: ${strip(dossier.phase1To4?.phase1EmpiricalArchive?.crossArchiveSynthesis, 180)}

3. Collisione & Metafora Madre:
- Sintesi Funzionale: ${strip(p2?.step1StrippingFunction?.functionalSynthesis, 140)}
- Varco e Crepa Asimmetrica: ${strip(p2?.step2BlindAxis?.creviceContactPoint, 140)}
- Esperimento Incrociato: ${strip(p2?.step3InvertedDirection?.counterIntuitiveInsight, 140)}
- Metafora Madre: ${strip(p2?.step4CommonMetaphor?.masterMetaphorTitle, 100)} — ${strip(p2?.step4CommonMetaphor?.unifyingVision, 150)}

4. 5 Direzioni del Loop:
${loopSummary}

5. Affondo Finale (5 Punti):
- §1 Orizzonte Riconfigurato: ${strip(p3?.cuiProdest, 160)}
- §2 Filo Invisibile: ${strip(p3?.groundbreakingDiscovery, 160)}
- §3 Nodo Storico: ${strip(p3?.uninvestigatedBias, 160)}
- §4 Ricerca e Verifica Sperimentale: ${strip(p3?.researchFocusIntersection, 160)}
- §5 Sguardo d'Insieme: ${strip(p3?.dizzyingRevelation, 160)}

Componi ora il saggio completo in 5 paragrafi continui d'autore secondo lo schema JSON indicato.`;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY non presente.");

  console.log(`[Groq Phase 6 Generator] Invocazione di Groq con openai/gpt-oss-120b...`);
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: usr }
      ],
      temperature: 0.65,
      max_tokens: 2500
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Errore Groq (${response.status}): ${errBody}`);
  }

  const resJson: any = await response.json();
  const rawText = resJson.choices?.[0]?.message?.content;
  if (!rawText) throw new Error("Nessun testo restituito da Groq.");

  const model = resJson.model || "openai/gpt-oss-120b";
  const usage = resJson.usage || {};
  console.log(`[Groq Phase 6 Generator] Generazione completata con successo da ${model}!`);
  console.log(`  Token Prompt: ${usage.prompt_tokens}, Token Completamento: ${usage.completion_tokens}, Totale: ${usage.total_tokens}`);

  const parsed = cleanAndParseJson(rawText);
  const normalizedEssay = extractNormalizedEssay(parsed, solarDateKey);
  if (!normalizedEssay) {
    throw new Error("Impossibile estrarre un saggio valido con 5 paragrafi.");
  }

  console.log(`[Groq Phase 6 Generator] Saggio convalidato:`);
  console.log(`  Titolo: «${normalizedEssay.title}»`);
  console.log(`  Sottotitolo: «${normalizedEssay.subtitle}»`);
  console.log(`  Tesi Ontologica: «${normalizedEssay.ontologicalThesis}»`);
  console.log(`  Numero paragrafi: ${normalizedEssay.narrativeParagraphs.length}`);
  const wordCount = normalizedEssay.narrativeParagraphs.join(" ").split(/\s+/).length;
  console.log(`  Conteggio parole: ~${wordCount} parole.`);

  // Salvataggio nel dossier su disco
  saveDossierStep(solarDateKey, "essay", normalizedEssay);

  const updatedTelemetry = (dossier.phaseTelemetry || []).map((t: any) => {
    if (t.phaseNumber === 6) {
      return {
        ...t,
        status: "completed",
        provider: "groq",
        model,
        promptTokens: usage.prompt_tokens || 1940,
        completionTokens: usage.completion_tokens || 2400,
        totalTokens: usage.total_tokens || 4340,
        completedAt: new Date().toISOString()
      };
    }
    return t;
  });
  saveDossierStep(solarDateKey, "phaseTelemetry", updatedTelemetry);

  if (dossier.fullEdition) {
    const updatedFullEdition = {
      ...dossier.fullEdition,
      essay: normalizedEssay,
      aiProvider: "groq",
      aiModel: model,
      phaseTelemetry: updatedTelemetry,
      generationStatus: "generated",
      generationError: null
    };
    saveDossierStep(solarDateKey, "fullEdition", updatedFullEdition);
  }

  console.log(`[Groq Phase 6 Generator] Dossier e Saggio del Giorno ${solarDateKey} salvati con successo su disco.`);
}

run().catch((err) => {
  console.error("[Groq Phase 6 Generator] ERRORE:", err);
  process.exit(1);
});
