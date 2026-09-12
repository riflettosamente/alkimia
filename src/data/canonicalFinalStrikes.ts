import { Phase3FinalStrike, DirectionFinalStrikeItem } from '../types';

/**
 * Genera la Fase 4: L'Affondo Finale (Il Sigillo della Ricerca)
 * Trasformazione dell'intuizione speculativa in un manifesto operativo attraverso cinque interrogativi strategici.
 * Ampliato per articolarsi sia a livello del Manifesto Generale, sia lungo le 5 Direzioni del Loop di Fase 3.
 */
export function buildPhase3FinalStrike(vectorAName: string, vectorBName: string): Phase3FinalStrike {
  const normA = vectorAName.toUpperCase();
  const normB = vectorBName.toUpperCase();

  // Caso 1: CRISPR & TCI (Transcomunicazione Strumentale)
  if ((normA.includes("CRISPR") || normA.includes("GENETICA")) && 
      (normB.includes("TRANSCOMUNICAZIONE") || normB.includes("TCI") || normB.includes("STRUMENTALE"))) {
    return {
      cuiProdest: "Viene smantellato il dogma del riduzionismo computazionale cieco che considera la materia vivente una pura macchina proteica isolata dal resto dell'ecosistema elettromagnetico, e parallelamente crolla l'illusione ottocentesca dello spiritismo naif. La centralità ontologica dell'essere umano viene restituita: la coscienza non è né un sottoprodotto accidentale della chimica, né un fantasma passivo, ma un'agenzia attiva di sintonizzazione capace di incidere e ordinare la sintassi del cosmo sia nella cellula sia nel rumore radio.",
      groundbreakingDiscovery: "La Teoria della Risonanza Morfica Elettrolinguistica: ogni segmento di DNA non agisce unicamente come sequenza nucleotidica locale, ma funge da antenna a cristalli liquidi operante su bande di frequenza sovrapposte al rumore termico di fondo. Ciò che la TCI registra come voci disincarnate è l'impronta di fase elettromagnetica lasciata da strutture biologiche che hanno impresso la propria configurazione nel vuoto quantistico locale prima di estinguersi.",
      uninvestigatedBias: "Il pregiudizio metodologico del determinismo molecolare e la fobia accademica verso le fenomenologie etichettate come 'paranormali'. La biologia accademica scarta aprioristicamente qualsiasi perturbazione acustica ed elettromagnetica non-locale considerandola 'artefatto sperimentale', mentre i ricercatori della TCI hanno storicamente trascurato la biofisica dei semiconduttori cellulari, ignorando che l'apparato ricevente e il corpo umano condividono le stesse costanti dielettriche.",
      researchFocusIntersection: "All'intersezione tra la Biofisica Topologica dei Polimeri Nucleici, l'Elaborazione Quantistica dei Segnali Elettromagnetici nel Vuoto e l'Epigenetica delle Radiofrequenze. In particolare, studiare le fluttuazioni di coerenza quantistica nei microtubuli e nel reticolo Cas9 in presenza di campi a radiofrequenza stocastici modulati da rumore bianco controllato.",
      dizzyingRevelation: "La scoperta che la realtà materiale che abitiamo non è un archivio sigillato di corpi chiusi, ma una 'stanza di registrazione vivente' in cui il passato organico e il presente elettromagnetico coesistono sullo stesso nastro. La porta girevole tra la vita biologica e l'eco incorporeo è il gradiente di fase: morire non significa dissolversi nel nulla, ma smettere di essere un file memorizzato su supporto solido per tornare ad essere un'onda portante distribuita nel sottofondo dell'universo.",
      directionStrikes: [
        {
          directionNumber: 1,
          directionTitle: "Direzione 1: La Faglia Semiotico-Sintattica (Il Codice vs La Frequenza)",
          ontologicalAngle: "Indagare il rapporto tra la scrittura materiale fissa e la fonazione volatile nel disordine hertziano.",
          cuiProdest: "Infrange il feticismo del 'gene come testo rigido' e l'ingenuismo della 'voce spiritica come persona intera'. Restituisce all'essere umano la consapevolezza che il linguaggio non è una nostra invenzione, ma la matrice stessa con cui il vivente scambia messaggi con il vuoto.",
          groundbreakingDiscovery: "Il Teorema della Sintassi Cromosomica Hertziana: i codoni del DNA non codificano solo amminoacidi chimici, ma emettono treni di solitoni acusto-elettrici sintonizzati sulle armoniche naturali del rumore atmosferico a onde corte.",
          uninvestigatedBias: "La presunzione che la genetica sia solo chimica organica e la radiofrequenza sia solo telecomunicazione ingegneristica, ignorando che entrambe poggiano sulla medesima teoria dell'informazione di Shannon applicata a mezzi dispersivi.",
          researchFocusIntersection: "Sintesi tra Linguistica Quantistica Computazionale, Spettroscopia Raman di filamenti plasmidici eccitati a radiofrequenza e Analisi Spettrale delle micro-formanti nei segnali EVP.",
          dizzyingRevelation: "La scoperta che il genoma scrive continuamente un copione sonoro nell'etere e che la TCI non intercetta estranei, ma decodifica la lettura ad alta voce che la biosfera compie del nostro stesso codice genetico."
        },
        {
          directionNumber: 2,
          directionTitle: "Direzione 2: La Faglia Termodinamico-Entropica (L'Entropia vs L'Informazione Neghentropica)",
          ontologicalAngle: "Far collidere il consumo energetico della riparazione molecolare con la dissipazione termica del rumore bianco.",
          cuiProdest: "Smantella il nichilismo termodinamico secondo cui la morte dissipa per sempre qualsiasi configurazione informativa, liberando l'uomo dalla disperazione del degrado entropico.",
          groundbreakingDiscovery: "La Legge di Neghentropia Postuma di Fase: quando un reticolo molecolare cessa di consumare ATP, la sua informazione topologica non viene distrutta ma transita istantaneamente nello spettro del rumore termico di Johnson sotto forma di micro-modulazioni di fase coerenti.",
          uninvestigatedBias: "L'assunto che il disordine massimo (rumore bianco) sia un deserto privo di struttura, invece di riconoscerlo come la massima densità probabilistica potenziale in cui sono compresenti tutti i segnali possibili.",
          researchFocusIntersection: "Intersezione tra Termodinamica dei Sistemi Fuori dall'Equilibrio di Prigogine, Criomicroscopia Elettronica a rilascio termico e Rivelatori Superconduttori a SQUID operanti al punto di congelamento cellulare.",
          dizzyingRevelation: "La vertigine che la materia non muore: la cellula è solo un accumulatore che quando si scarica accende per un istante il trasmettitore atemporale del campo."
        },
        {
          directionNumber: 3,
          directionTitle: "Direzione 3: La Faglia Topologica (La Località dello Spazio vs La Non-Località di Campo)",
          ontologicalAngle: "Scomporre l'ancoraggio spaziale microscopico (locus genico) contro la natura ubiquitaria del campo hertziano.",
          cuiProdest: "Distrugge la gabbia cartesiana della localizzazione stretta (l'idea che 'io' sia confinato solo dentro il perimetro della mia pelle), restituendo all'essere umano la dimensione di nodo ubiquitario.",
          groundbreakingDiscovery: "Il Principio dell'Antenna Molecolare Elicoidale: la doppia elica del DNA possiede proprietà induttive toroidali che connettono istantaneamente lo stato di spin nucleotidico locale a fluttuazioni elettromagnetiche distanti anni luce.",
          uninvestigatedBias: "Il dogma geometrico della località newtoniana applicato alla biologia molecolare, che impedisce di concepire il DNA come un'interfaccia topologica non-orientabile (bottiglia di Klein genica).",
          researchFocusIntersection: "Topologia Differenziale applicata all'avvolgimento del DNA (superavvolgimento plectonemico), Elettrodinamica Quantistica di Cavità e Ricezione Radiofenomenica in Camere Anecoiche Schermate da Gabbie di Faraday Iper-conducibili.",
          dizzyingRevelation: "Lo spazio è un miraggio di scala: all'interno del nucleo cellulare siamo già ovunque, e l'apparato radio della TCI non riceve segnali da un altrove lontano, ma risuona con la nostra stessa presenza de-localizzata."
        },
        {
          directionNumber: 4,
          directionTitle: "Direzione 4: La Faglia Epistemologico-Strumentale (Il Bisturi Meccanico vs La Trappola d'Ombre)",
          ontologicalAngle: "Analizzare la pretesa di controllo assoluto del protocollo di laboratorio contro l'ambiguità ermeneutica della registrazione acustica.",
          cuiProdest: "Guarisce la scienza dalla cecità dell'iper-controllo asettico e salva l'indagine intuitiva dalla trappola della credulità superstiziosa, unificando rigore e apertura al non-programmato.",
          groundbreakingDiscovery: "La Dinamica di Risonanza Indotta dall'Anomalia Fuori-Bersaglio: gli eventi 'off-target' di CRISPR e le inclusioni auditive della TCI obbediscono alla medesima distribuzione statistica di Lévy flight, segnalando finestre di biforcazione del reale dove la volontà incide sulle costanti fisiche locali.",
          uninvestigatedBias: "La rimozione selettiva del dato imprevisto: gli istituti di ricerca genetica cestinano le mutazioni stocastiche come difetti di pipettaggio, mentre la comunità paranormale scambia spesso echi di stazioni lontane per contatti metafisici.",
          researchFocusIntersection: "Statistica Robusta degli Eventi Rari, Algoritmi Bayesiani per la separazione cieca di sorgenti deboli e Sequenziamento Genomico ad Altissima Copertura associato a registrazione audio sincrona multicanale.",
          dizzyingRevelation: "La crepa nello specchio della ragione: il bisturi e la radio sono lo stesso compasso; la verità non sta né nell'assoluta precisione dell'esperimento né nel delirio soggettivo, ma nella frangia di interferenza tra la macchina e l'aspettativa dell'operatore."
        },
        {
          directionNumber: 5,
          directionTitle: "Direzione 5: La Faglia Coscienziale (L'Automa Biologico vs Il Testimone Sopravvivente)",
          ontologicalAngle: "Esplorare la soggettività dell'operatore: il ricercatore come chirurgo impersonale contro l'ascoltatore come cassa di risonanza affettiva.",
          cuiProdest: "Riconcilia la tecnologia con il cuore dell'uomo: smaschera l'ingegneria genetica come disperato tentativo di immortalità biologica e la TCI come invocazione relazionale, restituendo senso al lutto e alla memoria come ponti di conoscenza.",
          groundbreakingDiscovery: "Il Teorema del Campo di Coerenza Psico-Bio-Fisico: l'intenzionalità emotiva concentrata dello sperimentatore altera tangibilmente l'entropia del dielettrico nella giunzione a diodo ricevente e la frequenza di taglio enzimatica in vitro.",
          uninvestigatedBias: "Il dogma della totale separazione tra osservatore e osservato nell'epistemologia occidentale classica, che tratta la coscienza umana come uno spettatore irrilevante anziché come catalizzatore bio-informazionale.",
          researchFocusIntersection: "Neuroscienze Affettive ad Alta Risoluzione Temporale, Bio-fotoni a Coerenza Laser emessi dall'operatore durante compiti di concentrazione e Protocolli di Monitoraggio Sperimentale in Doppio Cieco Psicosomatico.",
          dizzyingRevelation: "La stanza finale è il teatro dell'attore unico: la mano che programma il gene sintetico e l'orecchio che trema ascoltando un fruscio nella notte appartengono alla medesima coscienza che gioca a perdersi nella carne e a ritrovarsi nel vento."
        }
      ]
    };
  }

  // Caso 2: Ghiandola Pineale & Aldilà (Afterlife)
  if ((normA.includes("PINEALE") || normA.includes("EPIFISI")) && 
      (normA.includes("ALDILÀ") || normA.includes("ALDILA") || normB.includes("ALDILÀ") || normB.includes("ALDILA") || normB.includes("AFTERLIFE"))) {
    return {
      cuiProdest: "Viene infranto l'epifenomenismo materialista che declassa ogni esperienza trascendente o perimortale a mero delirio ipossico del lobo temporale. Restituisce all'essere umano la dignità ontologica di un'interfaccia cosmica: l'essere umano non è un organismo condannato alla fine, ma un apparato di proiezione tridimensionale la cui valvola ottica è calibrata per garantire la sopravvivenza biologica.",
      groundbreakingDiscovery: "Il Principio di Trasduzione Piezoelettrica della Memoria Non-Locale: i microcristalli di calcite della pineale non sono scorie senili di calcificazione, ma operano una modulazione piezo-luminescente a banda ultra-stretta che mantiene la memoria soggettiva agganciata a un dominio olografico extra-temporale. La morte è la deconnessione del morsetto organico, che libera la traiettoria informativa nel dominio globale.",
      uninvestigatedBias: "La compartimentazione tra neurochimica endocrina ed escatologia filosofica. La medicina tratta l'epifisi come un semplice regolatore circadiano della melatonina, omettendo di investigare le proprietà quantistiche non-lineari dei cristalli di apatite; i teologi d'altro canto hanno spiritualizzato l'aldilà privandolo di qualsiasi consistenza geometrica o fisica.",
      researchFocusIntersection: "All'incrocio tra la Neurofisiologia dei Cristalli Piezoelettrici Biologici, la Teoria dei Campi Olografici di Bohm e la Fenomenologia Clinica degli Stati di Arresto Cardiaco Monitorato (EEG a banda larga sincronizzata).",
      dizzyingRevelation: "La vertigine che la 'stanza' dell'aldilà è esattamente la stessa stanza in cui ci troviamo ora, separata da noi non dalla distanza spaziale ma da una differenza di filtro percettivo. La Pineale è il riduttore di pressione che rende vivibile la materia densa; la porta girevole tra il mondo dei vivi e l'aldilà è un cambio di risoluzione del cristallo: cessato il battito, l'ombra della materia si dissipa e la luce totale dell'invisibile torna a farsi trasparenza primaria.",
      directionStrikes: [
        {
          directionNumber: 1,
          directionTitle: `Direzione 1: La Faglia della Trasduzione Meccanica (${vectorAName} come Soglia Fisica)`,
          ontologicalAngle: "Scomporre l'interfaccia biologica come filtro di frequenza rispetto alla continuità del campo trascendente.",
          cuiProdest: "Smantella il dogma che riduce l'esperienza spirituale a chimica cerebrale, mostrando che il cervello è un ricevitore e non un generatore di coscienza.",
          groundbreakingDiscovery: "La Trasduzione Piezo-Elettrica del Segnale Non-Locale: i microcristalli pineali convertono la pressione osmotica cerebrospinale in fotoni coerenti che sintonizzano la percezione sul campo atemporale.",
          uninvestigatedBias: "La classificazione medica dei cristalli pineali come semplice sabbia calcarea atrofica priva di funzione elettromagnetica attiva.",
          researchFocusIntersection: "Microscopia Elettronica a Scansione dei Cristalli di Apatite, Spettroscopia a Risonanza Magnetica e Fenomenologia NDE.",
          dizzyingRevelation: "La soglia tra questo mondo e l'altro è una questione di pressione meccanica: la morte disattiva il filtro e spalanca la ricezione a banda intera."
        },
        {
          directionNumber: 2,
          directionTitle: `Direzione 2: La Faglia Termodinamico-Entropica (Dissipazione vs Conservazione)`,
          ontologicalAngle: "Indagare come il consumo di energia biologica condizioni la permanenza della memoria nel sistema.",
          cuiProdest: "Infrange l'angoscia della perdita totale della memoria biografica e dell'identità personale dopo l'arresto metabolico.",
          groundbreakingDiscovery: "La Conservazione Olografica dell'Informazione Neurale: al cessare del gradiente termico biologico, la struttura di spin si fissa indelebilmente nella griglia dello spaziotempo di Planck.",
          uninvestigatedBias: "Il presupposto che senza glucosio e ossigeno non possa sussistere alcuna elaborazione o ritenzione di configurazioni mnemoniche.",
          researchFocusIntersection: "Termodinamica Quantistica Neurale, Modelli di Penrose-Hameroff per la Microtubulina e Tracciamento EEG ipotermico.",
          dizzyingRevelation: "Il decadimento termico è solo la rimozione della cassaforma temporanea: l'edificio della memoria rimane integro nello spazio informazionale."
        },
        {
          directionNumber: 3,
          directionTitle: `Direzione 3: La Faglia Topologica (La Dimensione Confinata vs Lo Spazio di Fase)`,
          ontologicalAngle: "Scomporre i limiti della tridimensionalità euclidea rispetto a una geometria a n-dimensioni.",
          cuiProdest: "Libera la mente dalla prigione dell'estensione tridimensionale, dimostrando che la vicinanza emotiva ed esistenziale non dipende dai chilometri o dal tempo storico.",
          groundbreakingDiscovery: "La Connessione Iperbolica Inter-Dimensionale: l'asse ventricolare cerebrale funge da collo di bottiglia topologico di Lorentz.",
          uninvestigatedBias: "La convinzione acritica che la realtà fisica debba necessariamente possedere solo tre dimensioni spaziali e una freccia temporale univoca.",
          researchFocusIntersection: "Topologia dei Colli di Verme Micro-Quantistici, Geometria Frattale delle Reti Gliali e Percezione Extrasensoriale Controllata.",
          dizzyingRevelation: "L'aldilà non è sopra il cielo o sotto terra: è a una frazione di millimetro lungo una dimensione piegata su se stessa."
        },
        {
          directionNumber: 4,
          directionTitle: `Direzione 4: La Faglia Epistemologica (Il Misurabile vs L'Incommensurabile)`,
          ontologicalAngle: "La collisione tra i protocolli di validazione quantitativa e la natura inafferrabile dell'evento singolare.",
          cuiProdest: "Restituisce dignità all'esperienza soggettiva interiore senza cadere nell'oscurantismo, aprendo a una nuova scienza basata sulla testimonianza coerente.",
          groundbreakingDiscovery: "La Correlazione Non-Locale tra Stati Meditativi Profondi e Fluttuazioni del Fondo Cosmico a Microonde.",
          uninvestigatedBias: "La pretesa scientifica di esigere la ripetibilità seriale a comando per fenomeni che richiedono una precisa sintonizzazione emotiva e intenzionale.",
          researchFocusIntersection: "Epistemologia della Prima Persona, Metriche di Entropia Informativa di Shannon su Segnali Neurale e Cronobiologia Pineale.",
          dizzyingRevelation: "La misurazione oggettiva è solo l'ombra che la cosa viva proietta sulla parete del laboratorio quando viene privata della sua luce nativa."
        },
        {
          directionNumber: 5,
          directionTitle: `Direzione 5: La Faglia Ontologico-Esistenziale (La Maschera della Forma vs L'Abisso del Fondamento)`,
          ontologicalAngle: "Il confronto ultimo tra la finitudine dell'ente individuale e l'abisso impersonale dell'essere.",
          cuiProdest: "Scioglie la paura primordiale della solitudine cosmica: non siamo gusci vuoti dispersi, ma manifestazioni necessarie della totalità.",
          groundbreakingDiscovery: "Il Principio di Identità Riflessiva Cosmica: la pineale è l'organo mediante cui l'Assoluto esperisce la caduta nella finitezza temporale.",
          uninvestigatedBias: "L'abitudine culturale a trattare la vita come un incidente chimico e la morte come un'ingiustizia invece che come una transizione geometrica fisiologica.",
          researchFocusIntersection: "Antropologia Filosofica, Neuroteologia Sperimentale e Fenomenologia Comparata delle Esperienze di Premorte (NDE).",
          dizzyingRevelation: "Nel momento in cui la maschera cade, non si scopre il nulla, ma lo sguardo originario che attendeva dietro gli occhi fin dal primo giorno."
        }
      ]
    };
  }

  // Fallback Canonico Generale
  return {
    cuiProdest: `Viene abbattuto l'isolamento teorico tra ${vectorAName} e ${vectorBName}, smantellando la falsa dicotomia che separa l'indagine empirica dal mistero del vivente e restituendo alla persona umana la pienezza di soggetto integrato nel tessuto del cosmo.`,
    groundbreakingDiscovery: `Il Principio di Isomorfismo Funzionale Profondo: la dinamica operativa di ${vectorAName} e la fenomenologia di ${vectorBName} condividono la stessa topologia invariante, dimostrando che l'universo replica la medesima grammatica regolativa sia nella micro-scala sia nella dimensione esperienziale.`,
    uninvestigatedBias: `L'iper-specializzazione accademica contemporanea, che educa i ricercatori a considerare ${vectorAName} e ${vectorBName} come territori reciprocamente inaccessibili o categorie incompatibili del pensiero.`,
    researchFocusIntersection: "All'intersezione tra Epistemologia dei Sistemi Complessi, Fenomenologia Strutturale e Scienze dei Confini della Materia Vivente.",
    dizzyingRevelation: `La vertigine che le categorie che credevamo distanti sono facce adiacenti della medesima architettura: il mondo visibile e l'invisibile comunicano costantemente tramite cerniere impercettibili, e la coscienza umana ne è il testimone e la chiave d'apertura.`,
    directionStrikes: [
      {
        directionNumber: 1,
        directionTitle: "Direzione 1: La Faglia Meccanico-Strutturale",
        ontologicalAngle: `Indagare l'interfaccia fisica diretta tra ${vectorAName} e ${vectorBName}.`,
        cuiProdest: "Smantella la convinzione che i due fenomeni operino su ordini di realtà inconciliabili.",
        groundbreakingDiscovery: `Identificazione del punto di accoppiamento dinamico tra ${vectorAName} e ${vectorBName}.`,
        uninvestigatedBias: "La tendenza a studiare la struttura materiale isolandola dal contesto di campo circostante.",
        researchFocusIntersection: "Tra Fisica delle Basse Energie, Analisi dei Segnali e Biofisica Sperimentale.",
        dizzyingRevelation: "La separazione tra le due strutture è puramente una convenzione terminologica del linguaggio scientifico ordinario."
      },
      {
        directionNumber: 2,
        directionTitle: "Direzione 2: La Faglia Termodinamica",
        ontologicalAngle: "Esplorare i bilanci energetici ed entropici generati dall'interazione.",
        cuiProdest: "Supera il riduzionismo meccanicistico a favore di una visione dissipativa e auto-organizzante.",
        groundbreakingDiscovery: "La generazione spontanea di ordine neghentropico alla soglia critica di contatto.",
        uninvestigatedBias: "L'applicazione cieca della termodinamica classica di equilibrio a processi aperti altamente non-lineari.",
        researchFocusIntersection: "Termodinamica di Non-Equilibrio e Teoria delle Fluttuazioni Estreme.",
        dizzyingRevelation: "La dispersione termica apparente è in realtà il consumo energetico necessario per sostenere l'invisibile."
      },
      {
        directionNumber: 3,
        directionTitle: "Direzione 3: La Faglia Topologica",
        ontologicalAngle: "Mappare le proprietà geometriche invarianti che collegano i due domini.",
        cuiProdest: "Libera l'osservatore dai vincoli della distanza spaziale e della metrica metrica standard.",
        groundbreakingDiscovery: "L'esistenza di una connessione topologica non-orientabile condivisa da entrambi i sistemi.",
        uninvestigatedBias: "La dipendenza esclusiva da coordinate cartesiane euclidee per descrivere fenomeni di rete complessa.",
        researchFocusIntersection: "Topologia dei Sistemi Complessi e Teoria dei Grafi Non-Locali.",
        dizzyingRevelation: "I due poli non comunicano viaggiando nello spazio: sono già in contatto attraverso una piega della geometria comune."
      },
      {
        directionNumber: 4,
        directionTitle: "Direzione 4: La Faglia Epistemologica",
        ontologicalAngle: "Analizzare come i limiti del nostro apparato di misura condizionano la teoria formulata.",
        cuiProdest: "Rende la ricerca scientifica consapevole dei propri angoli ciechi e dei propri pregiudizi di validazione.",
        groundbreakingDiscovery: "La rilevazione sistematica dell'effetto di perturbazione introdotto dallo strumento osservatore.",
        uninvestigatedBias: "L'illusione della neutralità dello sperimentatore e del dispositivo di cattura.",
        researchFocusIntersection: "Epistemologia Critica, Metrologia Quantistica e Filosofia della Scienza Sperimentale.",
        dizzyingRevelation: "Lo strumento non registra la realtà oggettiva: registra il patto silenzioso stipulato tra l'occhio umano e l'ombra del fenomeno."
      },
      {
        directionNumber: 5,
        directionTitle: "Direzione 5: La Faglia Ontologico-Coscienziale",
        ontologicalAngle: "Indagare il ruolo della coscienza umana come fondamento e cerniera dei due vettori.",
        cuiProdest: "Restituisce centralità all'essere umano senza cadere nell'antropocentrismo ingenuo.",
        groundbreakingDiscovery: "Il riconoscimento che la coscienza è il medium continuo entro cui si condensano sia i fatti fisici sia le intuizioni contemplative.",
        uninvestigatedBias: "Il rifiuto positivista di includere l'esperienza vissuta in prima persona nel bilancio della conoscenza oggettiva.",
        researchFocusIntersection: "Neurofenomenologia Integrata e Scienze Cognitive di Terza Generazione.",
        dizzyingRevelation: "L'universo non è una macchina che produce incidentalmente coscienza: è una coscienza che proietta geometrie per potersi toccare."
      }
    ]
  };
}
