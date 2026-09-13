# ALKIMIA

Generatore autonomo di saggi speculativi e di indagine ontologica.

Ogni giorno solare (UTC) il sistema estrae **due vettori ontologici** dagli otto disponibili,
li fa collidere attraverso un protocollo rigido a **tre fasi** e pubblica il saggio risultante
come *Saggio del Giorno*, senza alcun intervento dell'utente.

Pubblicazione: <https://alkimia.onrender.com>

---

## Gli otto vettori ontologici

Definiti in [`src/ai/ontologicalSystemPrompt.ts`](src/ai/ontologicalSystemPrompt.ts):

1. La Fisica (dei campi e dei quanti)
2. La Transcomunicazione Strumentale (TCI)
3. La Tecnologia CRISPR
4. La Ghiandola Pineale
5. La Spiritualità
6. L'Aldilà (Afterlife)
7. Gli UFO/UAP (Fenomeni Anomali Non Identificati)
8. Gli Extraterrestri

La coppia giornaliera è **deterministica**: `selectDailyVectorPair()` deriva un seed
dall'hash della data `YYYY-MM-DD`, quindi la stessa data produce sempre la stessa coppia
su ogni istanza e a ogni riavvio. `selectRandomVectorPair()` è invece usata
dall'endpoint di generazione manuale.

## Il protocollo a tre fasi

Implementato in [`src/ai/speculativeInvestigationEngine.ts`](src/ai/speculativeInvestigationEngine.ts).

| Fase | Contenuto |
| --- | --- |
| **Fase 1 — Scomposizione strutturale** | Griglia 6W + il Velato applicata a ciascun vettore: When/Where, What, How, Who, Which Boundary, Why / The Veiled Reality. |
| **Fase 2 — Collisione e loop cognitivo** | Quattro passaggi (spogliamento della funzione, asse cieco, inversione di direzione, metafora comune) attraversati da cinque prospettive: termodinamica/entropica, ecologico-evolutiva, semiotica/di traduzione, metamorfica/biologica, architetturale/sistemica. |
| **Fase 3 — Affondo e sintesi** | Saggio narrativo continuo di 1.200–1.800 parole con *zero structural leakage*: nessun elenco, nessuna etichetta di fase. Include «cui prodest», la denuncia dei recinti disciplinari inesplorati, la proposta di un nuovo campo di ricerca e la vertigine finale sull'infrastruttura del reale. |

Le fasi 1 e 2 hanno anche una resa **canonica locale** (`src/data/canonical*.ts`), usata come
contenuto provvisorio mentre l'AI lavora e come riserva se tutti i provider falliscono.

## Requisiti

- Node.js ≥ 20.11

## Avvio locale

```bash
npm install
cp .env.example .env      # poi valorizza almeno una chiave API
npm run dev               # http://localhost:3000
```

`npm run dev` esegue `tsx server.ts` in modalità sviluppo: il front-end è servito dal
middleware Vite con HMR attivo.

## Build e verifica

```bash
npm run lint      # tsc --noEmit
npm run build     # vite build + bundle esbuild di server.ts in dist/server.cjs
npm run smoke     # avvia dist/server.cjs e verifica endpoint, porta e stato di generazione
npm start         # node dist/server.cjs (produzione)
```

`npm run smoke` non richiede chiavi API: senza chiavi verifica che la catena di provider
fallisca **in modo esplicito** (`generation.status === "failed"` con motivo testuale)
invece che in silenzio.

## Configurazione

Tutte le variabili sono documentate in [`.env.example`](.env.example).

La catena di generazione ha questa priorità — un provider viene usato solo se **tutte** le
sue variabili obbligatorie sono presenti:

| Priorità | Provider | Variabili obbligatorie |
| --- | --- | --- |
| 1 | OpenRouter | `OPENROUTER_API_KEY` |
| 2 | Cloudflare Workers AI | `CLOUDFLARE_API_KEY` **e** `CLOUDFLARE_ACCOUNT_ID` |
| 3 | Google Gemini | `GEMINI_API_KEY` |

Opzionali: `OPENROUTER_MODEL`, `CLOUDFLARE_MODEL`, `GEMINI_MODEL`, `APP_URL`,
`AI_REQUEST_TIMEOUT_MS` (default 180000), `AI_RETRY_COOLDOWN_MS` (default 180000).

> I modelli gratuiti di OpenRouter hanno un limite di 20 richieste/minuto e 200/giorno.
> `meta-llama/llama-3.3-70b-instruct` **non** fa più parte della catena di fallback: è un
> modello a pagamento e senza credito risponde `402 Payment Required`. Per usarlo, carica
> credito e imposta esplicitamente `OPENROUTER_MODEL`.

## Deploy su Render

Il deploy è descritto in [`render.yaml`](render.yaml) (Blueprint). Impostazioni chiave:

| Campo | Valore |
| --- | --- |
| Runtime | Node |
| Build command | `npm install && npm run build` |
| Start command | `npm start` |
| Health check path | `/api/health` |

Il server legge `process.env.PORT` (con fallback a 3000) e fa il bind su `0.0.0.0`, come
richiesto da Render.

**Dopo ogni deploy** verifica con:

```bash
curl https://alkimia.onrender.com/api/health
```

Il campo `todayEdition.generation.status` deve valere `generated`. Se vale `failed`,
il campo `error` riporta il motivo testuale del fallimento della catena di provider.

> Sul piano gratuito Render manda l'istanza in sleep dopo 15 minuti di inattività.
> La cache delle edizioni è in memoria, quindi a ogni risveglio il warm-up all'avvio
> (`startServer`) fa ripartire la redazione del giorno; il front-end continua a
> interrogare il server finché il saggio resta provvisorio.

## API

| Metodo | Rotta | Descrizione |
| --- | --- | --- |
| GET | `/api/health` | Stato del servizio, provider configurati, stato della redazione odierna. |
| GET | `/api/ai-providers` | Dettaglio dei tre provider e dei modelli configurati. |
| GET | `/api/topics` | Gli otto vettori ontologici. |
| GET | `/api/select-vector-pair?solarDate=YYYY-MM-DD` | Coppia giornaliera (o casuale se `solarDate` è assente). |
| GET | `/api/daily-edition?solarDate=YYYY-MM-DD` | Edizione del giorno + blocco `generation` con lo stato. |
| GET | `/api/daily-edition/status?solarDate=YYYY-MM-DD` | Solo lo stato della redazione: usato per il polling. |
| POST | `/api/daily-edition/regenerate` | Rigenerazione esplicita. Body: `{ "solarDate", "wait", "force" }`. |
| POST | `/api/generate-autonomous-essay` | Generazione estemporanea su coppia casuale. |

### Stati della redazione

Il blocco `generation.status` assume uno di questi valori, esposti anche nella testata
della pagina:

- `generated` — saggio prodotto da un provider AI; `aiProvider` e `aiModel` indicano chi.
- `generating` — redazione in corso; il testo mostrato è il canone locale provvisorio.
- `failed` — tutti i provider hanno fallito; `generation.error` ne riporta il motivo.
- `placeholder` — nessuna generazione ancora tentata.

Solo lo stato `generated` viene persistito nel `localStorage` del browser: il contenuto
provvisorio non può più sostituire definitivamente il saggio reale.

## Struttura

```
server.ts                     Express + catena provider AI + scheduler giornaliero
src/ai/                       system prompt, otto vettori, motore a tre fasi
src/components/               viste delle tre fasi, testata, feed, whiteboard
src/data/                     canone locale (fase 1, 2, loop, fase 3) + edizione di riserva
src/hooks/useDailyScheduler.ts  sincronizzazione e polling del Saggio del Giorno
src/services/dailyScheduler.ts  cache locale e caricamento dell'edizione
src/types.ts                  contratto dati condiviso tra server e client
scripts/smoke.mjs             smoke test del bundle di produzione
```
