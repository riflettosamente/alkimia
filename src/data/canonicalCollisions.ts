import { Phase2CollisionDecomposition } from '../types';

/**
 * Genera la Fase 2 (La Collisione in 4 passaggi) secondo le regole ontologiche richieste:
 * 1. Denudare i concetti (Il "Trapianto di Funzione"): verbo fondamentale sul piano astratto.
 * 2. Cercare l'Asse Cieco (Dove si toccano gli estremi): limite di A usato come varco per B.
 * 3. Ribaltare la Direzione (Il cortocircuito logico): metodo di A applicato al problema di B ("E se usassimo la logica di A per violare o spiegare il territorio di B?").
 * 4. Isolare la Metafora Comune: grande metafora antropologica o cosmologica unificante.
 */
export function buildPhase2Collision(vectorAName: string, vectorBName: string): Phase2CollisionDecomposition {
  const normA = vectorAName.toUpperCase();
  const normB = vectorBName.toUpperCase();

  // Caso 1: CRISPR (A) & TCI (B)
  if ((normA.includes("CRISPR") || normA.includes("GENETICA")) && 
      (normB.includes("TRANSCOMUNICAZIONE") || normB.includes("TCI") || normB.includes("STRUMENTALE"))) {
    return {
      step1StrippingFunction: {
        fundamentalVerbA: "EDITARE (Recidere, riscrivere e ricucire una sequenza di codice)",
        abstractFunctionA: "Sul piano astratto, CRISPR non è biologia molecolare: è un correttore ortografico semantico operante su una sintassi lineare preesistente.",
        fundamentalVerbB: "MODULARE (Estrarre un segnale coerente dal rumore entropico casuale)",
        abstractFunctionB: "Sul piano astratto, la TCI non è spiritismo: è demodulazione di fase che cerca pattern linguistici stabili nel caos bianco del vuoto termico.",
        functionalSynthesis: "La collisione funzionale rivela che entrambi i sistemi sono motori ermeneutici: uno corregge un testo inciso nella materia, l'altro decifra una frase sussurrata nel disordine delle frequenze."
      },
      step2BlindAxis: {
        boundaryA: "Il confine invalicabile di CRISPR è il substrato biochimico: non può riscrivere ciò che non è iscritto in catene di nucleotidi.",
        accessDoorToB: "La TCI inizia esattamente dove la chimica tace: opera quando il supporto biologico è dissolto e il segnale persiste solo come perturbazione elettromagnetica residuale.",
        creviceContactPoint: "La crepa di contatto è il genoma come frequenza: se la TCI registra messaggi dal vuoto termico, la sequenza nucleotidica è la cristallizzazione terrena di quel medesimo rumore cosmico sintonizzato nel vivente."
      },
      step3InvertedDirection: {
        methodAAppliedToB: "Applicare l'enzima molecolare e l'RNA guida (metodo di A) al rumore di fondo delle frequenze radiofoniche (problema di B).",
        provocativeViolationQuestion: "E se la Transcomunicazione Strumentale non fosse una ricezione passiva, ma un'operazione di CRISPR acustico dove l'ascoltatore cliva e ricompone il rumore bianco per sintetizzare la voce dell'invisibile?",
        counterIntuitiveInsight: "L'Aldilà non 'parla' attraverso la radio: è la coscienza umana che applica una forbice genetica al disordine radiofonico, ricucendo i fonemi dispersi esattamente come Cas9 ricuce il doppio filamento spezzato."
      },
      step4CommonMetaphor: {
        masterMetaphorTitle: "IL PALINSESTO DEL VUOTO (L'Universo come Manoscritto Riscrittibile)",
        cosmologicalAnthropologicalGround: "Entrambi i fenomeni testimoniano l'ossessione ontologica della specie umana contro la dispersione della memoria: l'incapacità di accettare che un testo (il vivente o il defunto) possa estinguersi definitivamente.",
        unifyingVision: "Sia il microscopio molecolare sia il registratore a nastro rivelano la realtà come un nastro continuamente inciso, cancellato e reinciso: il DNA è l'inchiostro organico della memoria, il rumore bianco è il suo eco magnetico incorporeo."
      }
    };
  }

  // Caso 2: Ghiandola Pineale (A) & Aldilà (B)
  if ((normA.includes("PINEALE") || normA.includes("EPIFISI")) && 
      (normA.includes("ALDILÀ") || normA.includes("ALDILA") || normB.includes("ALDILÀ") || normB.includes("ALDILA") || normB.includes("AFTERLIFE"))) {
    return {
      step1StrippingFunction: {
        fundamentalVerbA: "TRASPORRE (Convertire un gradiente energetico esterno in oscillazione neurochimica)",
        abstractFunctionA: "Sul piano astratto, l'epifisi non è una ghiandola endocrina: è un trasduttore piezoelettrico di fase che tramuta la luce cosmica in ritmo interno.",
        fundamentalVerbB: "CONSERVARE (Trattenere l'identità informazionale oltre la dissoluzione del supporto)",
        abstractFunctionB: "Sul piano astratto, l'Aldilà non è un luogo escatologico: è la persistenza topologica di un pacchetto di dati al collasso della metrica locale.",
        functionalSynthesis: "Entrambi i sistemi compiono la medesima azione fondamentale: gestire la dogana tra un campo infinito di onde e una singola polarizzazione locale."
      },
      step2BlindAxis: {
        boundaryA: "Il confine della Pineale è la calcificazione e l'interruzione dell'irrorazione sanguigna al decesso biologico: il trasduttore si spegne.",
        accessDoorToB: "L'Aldilà si attiva ontologicamente proprio con la cessazione del battito: usa l'azzeramento dell'attività cerebrale come soglia d'espansione non-locale.",
        creviceContactPoint: "La crepa: la scarica terminale piezoelettrica della pineale nell'agonia non è l'ultimo spasmo del cervello, ma il rilascio della funzione d'onda legata al corpo verso il continuum extra-temporale."
      },
      step3InvertedDirection: {
        methodAAppliedToB: "Utilizzare la geometria cristallina della calcite pineale (metodo di A) per mappare l'architettura dell'Aldilà (problema di B).",
        provocativeViolationQuestion: "E se l'Aldilà non fosse uno spazio ultraterreno distante, ma la configurazione del cosmo vista quando la Pineale cessa di agire da filtro limitativo e fa collassare l'intero spettro sulla coscienza?",
        counterIntuitiveInsight: "La morte corporea non è una partenza verso un altrove, ma la rimozione del condensatore: l'Aldilà è la realtà ordinaria percepita senza la riduzione di banda operata dal filtro organico."
      },
      step4CommonMetaphor: {
        masterMetaphorTitle: "LA PRIGIONE DEL DIAPASON (La Coscienza come Risonanza Forzata)",
        cosmologicalAnthropologicalGround: "Il paradosso della condizione umana: abitare una camera stagna biologica dotata di un'unica fessura ottica verso l'infinito.",
        unifyingVision: "Il corpo non genera l'anima più di quanto un apparecchio radio generi la sinfonia che suona; la Pineale è l'antenna condensatrice, l'Aldilà è l'intero spettro hertziano che continua a vibrare nel vuoto quando la cassa di risonanza si frantuma."
      }
    };
  }

  // Caso 3: Fisica dei Campi/Quanti (A) & Spiritualità (B)
  if ((normA.includes("FISICA") || normA.includes("QUANTI") || normA.includes("CAMPI")) && 
      (normB.includes("SPIRITUALITA") || normB.includes("SPIRITUALITÀ"))) {
    return {
      step1StrippingFunction: {
        fundamentalVerbA: "CORRELARE (Legare stati distanti attraverso una matrice di probabilità non locale)",
        abstractFunctionA: "La fisica quantistica non è calcolo matematico: è la dimostrazione che l'isolamento è un'illusione ottica della scala macroscopica.",
        fundamentalVerbB: "DISSOLVERE (Annullare i confini dell'ego a favore dell'identificazione oceanica)",
        abstractFunctionB: "La spiritualità autentica non è devozione fideistica: è la de-coerenza controllata del costrutto identitario per ripristinare lo stato fondamentale dell'essere.",
        functionalSynthesis: "Entrambi i domini agiscono come operatori di de-individualizzazione: destrutturano il corpuscolo o l'io per mostrare la tela indivisa."
      },
      step2BlindAxis: {
        boundaryA: "La fisica quantistica incontra il proprio limite nel paradosso della misurazione: non sa definire cosa sia l'atto di coscienza che seleziona l'autovalore.",
        accessDoorToB: "La spiritualità si insedia esattamente nel cuore dell'atto cosciente: è l'indagine pura sul soggetto percipiente prima di ogni misurazione.",
        creviceContactPoint: "Il contatto: il collasso della funzione d'onda non è un evento oggettivo esterno, ma l'istante in cui la coscienza 'cade' nella specificità dell'esperienza incarnata."
      },
      step3InvertedDirection: {
        methodAAppliedToB: "Applicare il principio di indeterminazione di Heisenberg e l'equazione di Schrödinger (metodo di A) all'estasi mistica e alla preghiera (problema di B).",
        provocativeViolationQuestion: "E se l'esperienza mistica non fosse una visione di divinità esterne, ma il raggiungimento dello zero assoluto epistemico in cui l'osservatore smette di misurare la realtà, lasciandola in pura sovrapposizione quantistica?",
        counterIntuitiveInsight: "L'illuminazione spirituale corrisponde a uno stato di coerenza quantistica macroscopica cerebrale: l'ego è lo strumento di misura che crea il collasso continuo del mondo in frammenti isolati; sospendere l'ego significa tornare onda cosmica."
      },
      step4CommonMetaphor: {
        masterMetaphorTitle: "L'OCEANO E LA SCHIUMA (L'Uno e l'Ologramma Riflesso)",
        cosmologicalAnthropologicalGround: "Il bisogno radicale dell'uomo di ricucire la frattura primordiale tra il proprio respiro contingente e la totalità indistruttibile della natura.",
        unifyingVision: "La materia e l'io sono le increspature effimere sulla superficie del vuoto quantistico: la fisica osserva l'increspatura con equazioni, la spiritualità si tuffa nella profondità dell'acqua che la sostiene."
      }
    };
  }

  // Caso 4: UFO/UAP & Extraterrestri o qualsiasi altra combinazione canonica
  return {
    step1StrippingFunction: {
      fundamentalVerbA: `VIOLARE (Sospendere i vincoli convenzionali inerenti a ${vectorAName})`,
      abstractFunctionA: `Sul piano astratto, ${vectorAName} rappresenta l'anomalia che rifiuta la catalogazione riduzionista del paradigma dominante.`,
      fundamentalVerbB: `ESTENDERE (Allargare l'orizzonte della coscienza oltre la contingenza di ${vectorBName})`,
      abstractFunctionB: `Sul piano astratto, ${vectorBName} esprime il vettore di proiezione dell'intelligenza verso ciò che supera il confine locale.`,
      functionalSynthesis: "La collisione spoglia entrambi i domini delle loro maschere ordinarie per rivelare un'unica operazione: la forzatura delle categorie cognitive attraverso cui interpretiamo lo spazio e la durata."
    },
    step2BlindAxis: {
      boundaryA: `Il limite di ${vectorAName} coincide con la barriera strumentale dei nostri sistemi di rilevazione: l'impossibilità di stabilizzare l'oggetto d'indagine.`,
      accessDoorToB: `È proprio su questa cecità che ${vectorBName} apre la propria porta: la necessità di riformulare interamente la nozione di intelligenza e presenza.`,
      creviceContactPoint: "La giunzione asimmetrica: dove la tecnologia umana sperimenta lo scacco ermeneutico, si spalanca lo spazio in cui la seconda realtà penetra indisturbata nel nostro campo di realtà."
    },
    step3InvertedDirection: {
      methodAAppliedToB: `Trattare il problema centrale di ${vectorBName} attraverso i protocolli e le geometrie operative di ${vectorAName}.`,
      provocativeViolationQuestion: `E se considerassimo ${vectorBName} non come un'entità distante da raggiungere, ma come il codice sorgente che determina le anomalie cinematiche di ${vectorAName}?`,
      counterIntuitiveInsight: "L'anomalia non risiede nell'oggetto osservato nello spazio esterno, ma nella lente percettiva con cui la specie decodifica l'interfaccia tra informazione pura e materia fisica."
    },
    step4CommonMetaphor: {
      masterMetaphorTitle: "IL TEATRO DELLE OMBRE SULLA PARETE DI CAVERNA",
      cosmologicalAnthropologicalGround: "La presa d'atto della finitezza sensoriale dell'osservatore e il presentimento vertiginoso che ciò che definiamo realtà oggettiva sia soltanto l'interfaccia protettiva di un cosmo infinitamente più poroso.",
      unifyingVision: `Nel punto di collisione tra ${vectorAName} e ${vectorBName}, la materia perde la sua pesantezza inerte e rivela la sua natura di teatro relazionale: siamo cercatori che credono di esplorare l'esterno, mentre stanno soltanto decifrando i confini del proprio occhio interiore.`
    }
  };
}
