import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { KEY_ONTOLOGICAL_TOPICS, buildOntologicalSystemPrompt } from "./src/ai/ontologicalSystemPrompt";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY non configurata nell'ambiente.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    systemPromptStatus: "pronto_per_8_argomenti_chiave",
    timestamp: new Date().toISOString()
  });
});

// 2. Consulta degli argomenti chiave
app.get("/api/topics", (_req, res) => {
  res.json({
    count: Object.keys(KEY_ONTOLOGICAL_TOPICS).length,
    topics: Object.values(KEY_ONTOLOGICAL_TOPICS),
    systemPromptSample: buildOntologicalSystemPrompt().slice(0, 500) + "..."
  });
});

// 3. Generazione Autonoma alimentata dal System Prompt
app.post("/api/generate-autonomous-essay", async (req, res) => {
  try {
    const { vectorA, vectorB, domain } = req.body;
    
    const topicKeys = Object.keys(KEY_ONTOLOGICAL_TOPICS);
    const selectedA = vectorA || (topicKeys.length > 0 ? KEY_ONTOLOGICAL_TOPICS[topicKeys[0]]?.name : "Indagine Ontologica Primaria");
    const selectedB = vectorB || (topicKeys.length > 1 ? KEY_ONTOLOGICAL_TOPICS[topicKeys[1]]?.name : "Contingenza e Frattura");

    const prompt = `Genera un nuovo fascicolo per la pubblicazione diurna autonoma delle 24 ore.
Combina e indaga la tensione dialettica tra i seguenti vettori concettuali:
- VETTORE A: ${selectedA}
- VETTORE B: ${selectedB}
- DOMINIO D'INDAGINE: ${domain || "Morfologia dell'Infondatezza e Frattura del Principio di Ragione"}

Applica rigorosamente il System Prompt. Rispondi esclusivamente in formato JSON valido che rispetti la seguente struttura:
{
  "systemPair": {
    "vectorA": "string",
    "vectorB": "string",
    "syntheticVector": "string",
    "ontologicalMatrix": "string"
  },
  "essay": {
    "title": "string",
    "subtitle": "string",
    "ontologicalThesis": "string",
    "preamble": "string",
    "sections": [
      {
        "numeral": "I",
        "title": "string",
        "propositions": [
          { "notation": "§ 1.01", "statement": "string", "commentary": "string" },
          { "notation": "§ 1.02", "statement": "string", "commentary": "string" }
        ]
      }
    ],
    "corollaries": ["string", "string", "string"],
    "openAporias": ["string", "string"],
    "bibliographicResonances": [
      { "author": "string", "concept": "string", "note": "string" }
    ]
  },
  "pins": [
    { "marker": "string", "text": "string", "context": "string", "type": "postulato | aporia | faglia | evidenza" }
  ],
  "tensions": [
    { "poleA": "string", "poleB": "string", "field": "string", "state": "string" }
  ]
}`;

    const ai = getGenAI();
    const systemPrompt = buildOntologicalSystemPrompt();

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });

    const responseText = response.text || "{}";
    const parsedData = JSON.parse(responseText);

    res.json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error("Errore generazione autonoma:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Errore durante l'elaborazione del saggio speculativo." 
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Motore Ontologico in esecuzione su http://0.0.0.0:${PORT}`);
  });
}

startServer();
