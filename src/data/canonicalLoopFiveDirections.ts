import { Phase2LoopFiveDirections } from '../types';

/**
 * Fase 2.2: Loop Fase a 5 Direzioni.
 * Applica la Fase 2, attraverso lo stesso identico binario concettuale con cinque angolazioni differenti,
 * costringendo il protocollo dei 4 passaggi a girare a vuoto in cerca di attriti sempre nuovi,
 * svelando cinque diverse faglie ontologiche.
 */
export function buildPhase2LoopFiveDirections(vectorAName?: string, vectorBName?: string): Phase2LoopFiveDirections {
  const normA = (vectorAName || "").toUpperCase();
  const normB = (vectorBName || "").toUpperCase();

  // Caso 1: CRISPR (A) & TCI (B)
  if ((normA.includes("CRISPR") || normA.includes("GENETICA")) && 
      (normB.includes("TRANSCOMUNICAZIONE") || normB.includes("TCI") || normB.includes("STRUMENTALE"))) {
    return {
      theoreticalPreamble: "Il protocollo dei 4 passaggi viene costretto a reiterare sullo stesso binario (CRISPR vs TCI) lungo 5 angolazioni distinte (Semiotico-Informatica, Termodinamico-Entropica, Topologico-Spaziale, Epistemologico-Strumentale, Coscienziale-Spettatoriale), inducendo il sistema a girare a vuoto per liberarsi dalle analogie superficiali e svelare cinque faglie ontologiche inedite.",
      tracks: [
        {
          id: "dir-1-semiotic",
          directionNumber: 1,
          directionTitle: "Angolazione 1: La Faglia Semiotico-Sintattica (Il Codice vs La Frequenza)",
          ontologicalAngle: "Indagare il rapporto tra la scrittura materiale fissa e la fonazione volatile nel disordine hertziano.",
          collision: {
            step1StrippingFunction: {
              fundamentalVerbA: "COMPILARE (Tradurre istruzioni discrete in architetture proteiche)",
              abstractFunctionA: "CRISPR è un compilatore di sintassi chiusa: interviene su una biblioteca di caratteri finiti per evitare errori di battitura fenotipica.",
              fundamentalVerbB: "DEMODULARE (Estrarre semantica contingente da un mezzo analogico continuo)",
              abstractFunctionB: "La TCI opera come un interprete di fonemi fluttuanti che cerca di dare senso grammaticale al bianco continuo.",
              functionalSynthesis: "Collisione: Entrambi sono macchine di transcodifica che tentano di imporre la parola (logos) al silenzio muto o al fruscio sordo."
            },
            step2BlindAxis: {
              boundaryA: "CRISPR si arresta davanti al nucleotide inerte: non può tradurre l'intenzione, solo la catena chimica.",
              accessDoorToB: "La TCI parte proprio dall'intenzione pura che scavalca la materia e tenta di parlare direttamente all'etere.",
              creviceContactPoint: "La crepa: il genoma umano è un testo che attende di essere letto ad alta voce da un ricevitore che non appartiene al regno biologico."
            },
            step3InvertedDirection: {
              methodAAppliedToB: "Applicare l'RNA guida molecolare alle fluttuazioni di ampiezza delle onde corte.",
              provocativeViolationQuestion: "E se usassimo sequenze di codoni genetici come filtri matematici per scansionare il rumore radiofonico, scoprendo che la voce dei defunti parla la grammatica delle triplette amminoacidiche?",
              counterIntuitiveInsight: "La TCI non riceve spiriti esogeni, ma decifra l'eco acustico dell'espressione genica dell'operatore proiettata nel campo elettromagnetico circostante."
            },
            step4CommonMetaphor: {
              masterMetaphorTitle: "LA TIPOGRAFIA DEL VENTO",
              cosmologicalAnthropologicalGround: "L'esigenza umana che l'universo non sia un balbettio casuale, ma una frase compiuta.",
              unifyingVision: "Il DNA stampa la vita su fogli di carne; la radio tenta di catturare i fogli strappati e dispersi nel vento del tempo."
            }
          }
        },
        {
          id: "dir-2-thermodynamic",
          directionNumber: 2,
          directionTitle: "Angolazione 2: La Faglia Termodinamica (L'Entropia vs L'Informazione Neghentropica)",
          ontologicalAngle: "Far collidere il consumo energetico della riparazione molecolare con la dissipazione termica del rumore bianco.",
          collision: {
            step1StrippingFunction: {
              fundamentalVerbA: "ORDINARE (Resistere al decadimento termodinamico tramite spesa di energia metabolica)",
              abstractFunctionA: "CRISPR è una pompa neghentropica che ripara le rotture del nastro organico per prolungare la durata della forma.",
              fundamentalVerbB: "ACCETTARE IL DISORDINE (Utilizzare la massima entropia come sorgente probabilistica)",
              abstractFunctionB: "La TCI accetta il collasso termico: sfrutta il rumore bianco (massima entropia informativa) come matrice di possibilità.",
              functionalSynthesis: "Collisione: CRISPR lotta contro l'entropia; la TCI si nutre dell'entropia per scorgervi l'invisibile."
            },
            step2BlindAxis: {
              boundaryA: "Il confine di CRISPR è il secondo principio della termodinamica: prima o poi la riparazione cede e la cellula muore.",
              accessDoorToB: "La TCI subentra nel punto di resa termica: fa del decadimento irreversibile del corpo il presupposto per la ricezione dell'anomalia.",
              creviceContactPoint: "La crepa: il rumore bianco non è caos privo di vita, ma la biomassa energetica residua rilasciata da tutti gli stati biologici estinti."
            },
            step3InvertedDirection: {
              methodAAppliedToB: "Applicare l'endonucleasi Cas9 come forbice termica sulle fluttuazioni del rumore johnsoniano.",
              provocativeViolationQuestion: "E se l'entropia massima di un circuito a valvole fosse il substrato in cui si compie la sintesi proteica dell'aldilà?",
              counterIntuitiveInsight: "La vita biologica consuma ordine per produrre calore; la TCI consuma calore per estrarre frammenti di un ordine incorporeo post-biologico."
            },
            step4CommonMetaphor: {
              masterMetaphorTitle: "LA BRACE CHE RICORDA IL FUOCO",
              cosmologicalAnthropologicalGround: "La resistenza istintiva dell'essere contro la dispersione termica definitiva.",
              unifyingVision: "La cellula e l'apparato radio sono due fornaci con tiraggio opposto: una brucia per mantenere il contorno, l'altra attende che il contorno crolli per ascoltare il fumo."
            }
          }
        },
        {
          id: "dir-3-topological",
          directionNumber: 3,
          directionTitle: "Angolazione 3: La Faglia Topologica (La Località dello Spazio vs La Non-Località di Campo)",
          ontologicalAngle: "Scomporre l'ancoraggio spaziale microscopico (locus genico) contro la natura ubiquitaria del campo hertziano.",
          collision: {
            step1StrippingFunction: {
              fundamentalVerbA: "LOCALIZZARE (Individuare un indirizzo spaziale nanometrico preciso su un filamento)",
              abstractFunctionA: "CRISPR è un sistema di coordinate cartesiane estreme: trova la coordinata X,Y,Z nella doppia elica e lì compie il taglio.",
              fundamentalVerbB: "DISPERDERE (Diffondere l'informazione su uno spettro privo di centro geometrico)",
              abstractFunctionB: "La TCI è topologia de-localizzata: il segnale non ha un'origine spaziale misurabile nel laboratorio, è ovunque e in nessun luogo.",
              functionalSynthesis: "Collisione: La tensione tra il punto geometrico puntiforme e il continuum ondulatorio ubiquo."
            },
            step2BlindAxis: {
              boundaryA: "Il limite di CRISPR è la prigione della vicinanza: può interagire solo se tocca fisicamente il ligando chimico.",
              accessDoorToB: "La TCI ignora la metrica metrica: non esiste distanza tra il mittente supposto e il diodo di ricezione.",
              creviceContactPoint: "La crepa: la conformazione spaziale a doppia elica del DNA agisce essa stessa come una spirale induttiva che capta la non-località del campo."
            },
            step3InvertedDirection: {
              methodAAppliedToB: "Mappare le frequenze ultracorte come se fossero cromosomi e loci genetici da editare con RNA guida.",
              provocativeViolationQuestion: "E se l'etere radiofonico contenesse un cariotipo invisibile in cui ogni banda d'onda corrisponde a una specie vivente disincarnata?",
              counterIntuitiveInsight: "Non stiamo ascoltando fantasmi lontani nel cielo: stiamo sintonizzando la conformazione topologica del nostro stesso DNA che si proietta nello spazio della stanza."
            },
            step4CommonMetaphor: {
              masterMetaphorTitle: "LA SPIRALE E LO SPECCHIO SFERICO",
              cosmologicalAnthropologicalGround: "Il dilemma dell'uomo radicato in un punto ma capace di concepire l'infinito ubiquo.",
              unifyingVision: "Il gene è un chiodo conficcato nel terreno; la frequenza è la cupola celeste. L'editing genetico piega il chiodo, la TCI ascolta la cupola che vibra al colpo di martello."
            }
          }
        },
        {
          id: "dir-4-epistemic",
          directionNumber: 4,
          directionTitle: "Angolazione 4: La Faglia Epistemologico-Strumentale (Il Bisturi Meccanico vs La Trappola d'Ombre)",
          ontologicalAngle: "Analizzare la pretesa di controllo assoluto del protocollo di laboratorio contro l'ambiguità ermeneutica della registrazione acustica.",
          collision: {
            step1StrippingFunction: {
              fundamentalVerbA: "DETERMINARE (Garantire la replicabilità al 99.9% di un esito programmato)",
              abstractFunctionA: "CRISPR è il trionfo dell'epistemologia predittiva: so esattamente dove taglio e cosa verrà riparato.",
              fundamentalVerbB: "INTERPRETARE (Navigare l'incertezza percettiva dove l'osservatore co-crea il dato)",
              abstractFunctionB: "La TCI è ermeneutica dell'ambiguità: il segnale è sempre al limite della pareidolia, sfugge alla replicabilità cieca.",
              functionalSynthesis: "Collisione: Lo scontro frontale tra la precisione algoritmica computabile e la soggettività indiziaria dell'ascolto."
            },
            step2BlindAxis: {
              boundaryA: "CRISPR fallisce quando insorgono i tagli fuori bersaglio (off-target): il terrore dell'imprevisto e dell'anomalia.",
              accessDoorToB: "La TCI esiste SOLO nell'off-target: vive proprio nell'interferenza imprevista e nella deviazione dal canale pulito.",
              creviceContactPoint: "La crepa: la mutazione biologica casuale è l'equivalente genetico dell'interferenza paranormale nella bobina magnetica."
            },
            step3InvertedDirection: {
              methodAAppliedToB: "Applicare il rigore dell'enzima Cas9 per epurare la pareidolia dal nastro magnetico.",
              provocativeViolationQuestion: "E se l'errore 'off-target' di CRISPR non fosse un difetto enzimatico, ma il tentativo del genoma di sintonizzarsi su una trasmissione della TCI cellulare?",
              counterIntuitiveInsight: "La certezza scientifica di CRISPR e l'illusione pareidolica della TCI sono le due estremità dello stesso binocolo: una focalizza la grana della materia, l'altra la vertigine dell'osservatore che vi si specchia."
            },
            step4CommonMetaphor: {
              masterMetaphorTitle: "IL MICROSCOPIO BIFRONTE",
              cosmologicalAnthropologicalGround: "Il terrore primordiale della specie umana davanti a ciò che non può calibrare perfettamente.",
              unifyingVision: "L'uomo costruisce strumenti per dominare il destino (CRISPR) e strumenti per implorare una risposta dall'ignoto (TCI): in entrambi i casi, guarda se stesso attraverso lenti artificiali."
            }
          }
        },
        {
          id: "dir-5-consciousness",
          directionNumber: 5,
          directionTitle: "Angolazione 5: La Faglia Coscienziale (L'Automa Biologico vs Il Testimone Sopravvivente)",
          ontologicalAngle: "Esplorare la soggettività dell'operatore: il ricercatore come chirurgo impersonale contro l'ascoltatore come cassa di risonanza affettiva.",
          collision: {
            step1StrippingFunction: {
              fundamentalVerbA: "OGGETTIVARE (Separare rigorosamente l'operatore dall'organismo modificato)",
              abstractFunctionA: "CRISPR postula la neutralità asettica: il DNA è solo un polimero chimico estraneo alla mente del ricercatore.",
              fundamentalVerbB: "RISONARE (Includere lo stato emotivo e intenzionale dell'ascoltatore nel circuito ricevente)",
              abstractFunctionB: "La TCI richiede sintonizzazione affettiva: senza l'aspettativa e il lutto dell'osservatore, il rumore resta mero fruscio.",
              functionalSynthesis: "Collisione: L'illusione dell'asetticità oggettiva collassa contro il coinvolgimento quantico dell'osservatore partecipe."
            },
            step2BlindAxis: {
              boundaryA: "CRISPR non sa spiegare da dove origini l'intenzionalità che guida la mano del genetista a modificare il codice.",
              accessDoorToB: "La TCI mette l'intenzionalità al centro esatto della macchina: la mente umana funge da bobina di carico per il circuito.",
              creviceContactPoint: "La crepa: il desiderio dell'uomo di vincere la morte tramite terapia genica è la stessa pulsione che lo spinge ad accendere una radio nella notte per parlare con chi non c'è più."
            },
            step3InvertedDirection: {
              methodAAppliedToB: "Trattare il dolore del lutto come un gene difettoso da asportare tramite forbice molecolare applicata alle registrazioni.",
              provocativeViolationQuestion: "E se l'editing genomico fosse solo la forma moderna e materialista della necromanzia, dove invece di evocare gli antenati tentiamo di impedirci di raggiungerli?",
              counterIntuitiveInsight: "La transcomunicazione e la terapia genica sono due tecnologie del lutto: una cerca di richiamare chi è partito, l'altra cerca disperatamente di non farlo partire mai."
            },
            step4CommonMetaphor: {
              masterMetaphorTitle: "L'ORACOLO DI NARCISO SUL FIUME DEL TEMPO",
              cosmologicalAnthropologicalGround: "L'intollerabilità della sparizione dell'amato e la lotta titanica contro l'oblio.",
              unifyingVision: "L'ingegneria genetica e la transcomunicazione sono le due sponde del fiume Lete: da una parte tentiamo di scolpire la statua affinché non si consumi, dall'altra lanciamo sassi nell'acqua per vedere se un'onda ritorna a riva."
            }
          }
        }
      ]
    };
  }

  // Fallback per Ghiandola Pineale (A) & Aldilà (B) o altre coppie
  const vA = vectorAName || 'il Primo Argomento';
  const vB = vectorBName || 'il Secondo Argomento';
  return {
    theoreticalPreamble: `Il protocollo dei 4 passaggi viene applicato sul binario concettuale formato da ${vA} e ${vB} lungo cinque direzioni angolari complementari.`,
    tracks: [
      {
        id: "dir-1-transduction",
        directionNumber: 1,
        directionTitle: `Direzione 1: Prospettiva Termodinamica / Entropica`,
        ontologicalAngle: `Confrontare il bilancio energetico, il rumore termico e i limiti di sensibilità degli strumenti utilizzati per studiare **${vA}** con la coerenza interna e la persistenza dei fenomeni osservati in **${vB}**.`,
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: "FILTRARE (Isolare un segnale misurabile dal rumore di fondo)",
            abstractFunctionA: `Sul piano operativo e strumentale, lo studio di **${vA}** lavora come un selettore rigoroso di banda: ogni apparecchio di misura è costruito per separare una variazione fisica precisa dal disordine termico ed elettromagnetico dell'ambiente circostante.`,
            fundamentalVerbB: "PERSISTERE (Mantenere una traccia coerente oltre la soglia ordinaria)",
            abstractFunctionB: `Sul versante di **${vB}**, il fenomeno si manifesta come una configurazione di senso e di informazione che continua a emergere anche quando i parametri energetici ordinari sembrerebbero insufficienti a sostenerla.`,
            functionalSynthesis: `Quando mettiamo a confronto il gesto di **filtrare** proprio di **${vA}** e la capacità di **persistere** documentata in **${vB}**, comprendiamo che non si tratta di due operazioni opposte ma di due fasi consecutive dello stesso processo di osservazione.\n\nLo strumento tecnico del primo campo definisce la soglia visibile del fenomeno, mentre il secondo campo raccoglie esattamente ciò che attraversa quella soglia: insieme mostrano che il limite di un rilevatore non coincide con la fine del fenomeno, ma con il punto in cui cambia il modo in cui l'informazione si conserva e si trasmette.`
          },
          step2BlindAxis: {
            boundaryA: `Il limite insuperabile degli strumenti applicati a **${vA}** è la soglia del rumore termico: al di sotto di una certa intensità fisica, il sensore non riesce più a distinguere tra una fluttuazione casuale della materia e un segnale strutturato.`,
            accessDoorToB: `È proprio dentro questa zona d'ombra strumentale che prende avvio l'indagine su **${vB}**, la quale raccoglie le anomalie, le esperienze e le tracce che continuano a presentarsi là dove gli apparecchi convenzionali segnano soltanto fondo indistinto.`,
            creviceContactPoint: `Il punto di contatto concreto — la crepa asimmetrica che unisce **${vA}** e **${vB}** — si trova esattamente sulla linea di confine in cui l'energia fisica misurabile sembra disperdersi nel rumore di fondo ma conserva in realtà una precisa organizzazione interna.\n\nIn questa cerniera tra i due domini, ciò che per il primo strumento appare come una perdita di segnale o un semplice disturbo termico si rivela, alla luce del secondo argomento, come il passaggio del fenomeno a un livello più sottile di coerenza, dove l'informazione non scompare ma cambia stato.`
          },
          step3InvertedDirection: {
            methodAAppliedToB: `Applicare i protocolli di analisi del segnale e di riduzione del rumore sviluppati per **${vA}** direttamente allo studio delle anomalie e delle testimonianze di **${vB}**, senza però tagliare via con filtri automatici le fluttuazioni di soglia.`,
            provocativeViolationQuestion: `E se ciò che osserviamo in **${vB}** non fosse un evento estraneo alle leggi della fisica, ma l'immagine nitida di ciò che accade quando i meccanismi di **${vA}** operano al di sotto della soglia di rumore dei nostri strumenti abituali?`,
            counterIntuitiveInsight: `Ribaltando la prospettiva emerge un'intuizione inattesa: la distanza tra **${vA}** e **${vB}** non dipende dal fatto che appartengano a due mondi incompatibili, ma dal modo in cui abbiamo calibrato i nostri strumenti di osservazione.\n\nQuando smettiamo di cancellare come errore statistico le variazioni più sottili registrate nel primo campo, ci accorgiamo che esse disegnano esattamente la trama dei fenomeni descritti nel secondo: l'anomalia non viola la regola fisica, ma ne svela il comportamento quando opera al massimo grado di sensibilità.`
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "IL PRISMA CHE SCOMPONE IL BIANCO",
            cosmologicalAnthropologicalGround: `L'abitudine umana a scambiare la singola banda di colore isolata dai nostri strumenti per la totalità della luce che attraversa l'esperienza.`,
            unifyingVision: `Come un prisma ottico, l'indagine su **${vA}** isola le frequenze più nette e misurabili, mentre **${vB}** ci ricorda la presenza dell'intero spettro luminoso da cui quei singoli raggi provengono.`
          }
        }
      },
      {
        id: "dir-2-entropy",
        directionNumber: 2,
        directionTitle: `Direzione 2: Prospettiva Ecologico-Evolutiva`,
        ontologicalAngle: `Esaminare il ruolo degli scienziati, dei pionieri e dei testimoni oculari censiti tra **${vA}** e **${vB}**, osservando come la mente umana reagisce, interpreta e si adatta di fronte a ciò che supera le conoscenze consolidate.`,
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: " CATALOGARE (Ricondurre l'osservazione entro modelli condivisi)",
            abstractFunctionA: `Nella storia di **${vA}**, i ricercatori e le istituzioni hanno lavorato per ordinare i dati sperimentali dentro griglie rigorose, proteggendo la stabilità del metodo scientifico dalle anomalie non immediatamente spiegabili.`,
            fundamentalVerbB: "TESTIMONIARE (Farsi carico di un'esperienza che precede la teoria)",
            abstractFunctionB: `Nella storia di **${vB}**, i pionieri, i clinici e i testimoni oculari hanno invece accettato di registrare e raccontare ciò che vedevano accadere dal vivo, anche quando mancava ancora un vocabolario teorico per spiegarlo.`,
            functionalSynthesis: `L'incontro tra il gesto di **catalogare** (proprio degli specialisti di **${vA}**) e il gesto di **testimoniare** (proprio dei protagonisti di **${vB}**) mette in luce come avanza realmente la conoscenza umana.\n\nDa sola, la catalogazione rischia di chiudersi in un archivio che esclude tutto ciò che non conosce ancora; da sola, la testimonianza rischia di restare un racconto isolato. Quando invece dialogano, il rigore del primo campo offre gli strumenti di verifica a ciò che i testimoni del secondo hanno avuto il coraggio di osservare per primi.`
          },
          step2BlindAxis: {
            boundaryA: `Il limite umano e istituzionale di chi studia **${vA}** emerge quando un dato anomalo viene scartato a priori solo perché non rientra nei manuali dell'epoca, lasciando inspiegata una parte reale dell'esperienza.`,
            accessDoorToB: `Proprio i casi scartati dai protocolli ufficiali diventano il punto di partenza degli studiosi e dei testimoni di **${vB}**, che custodiscono quelle osservazioni di confine in attesa di una comprensione più matura.`,
            creviceContactPoint: `La crepa asimmetrica tra le due comunità di ricerca si apre nel momento in cui lo scienziato di laboratorio e il testimone diretto si accorgono di aver descritto, con due linguaggi diversi, lo stesso identico evento.\n\nSu questa linea di contatto cade la barriera tra "osservatore esterno" e "soggetto partecipe": le cronache storiche di **${vB}** cessano di apparire come semplici aneddoti soggettivi e diventano preziosi indizi sul campo che indicano agli strumenti di **${vA}** dove puntare lo sguardo.`
          },
          step3InvertedDirection: {
            methodAAppliedToB: `Leggere i resoconti dei testimoni e dei pionieri di **${vB}** con la stessa attenzione tecnica con cui si analizzano i quaderni di laboratorio di **${vA}**, cercando le costanti ricorrenti anziché le differenze lessicali.`,
            provocativeViolationQuestion: `E se i testimoni storici di **${vB}** avessero registrato con straordinaria fedeltà percettiva gli stessi fenomeni che la strumentazione di **${vA}** sta iniziando a misurare soltanto oggi?`,
            counterIntuitiveInsight: `L'intuizione contro-intuitiva che ne scaturisce ribalta il pregiudizio consueto: l'essere umano non è un rilevatore difettoso da sostituire con le macchine, ma è spesso il primo sensore ad accorgersi di una novità della natura molto prima che vengano costruiti gli apparecchi capaci di misurarla.\n\nRileggendo insieme i due archivi, scopriamo che molte intuizioni considerate a lungo marginali in **${vB}** anticipavano con precisione meccanismi che oggi **${vA}** ci permette finalmente di comprendere su basi verificabili.`
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "LA VEDETTA E IL CARTOGRAFO",
            cosmologicalAnthropologicalGround: `La cooperazione necessaria, nella storia umana, tra chi scorge per primo una terra sconosciuta all'orizzonte e chi traccia le coordinate per raggiungerla.`,
            unifyingVision: `**${vB}** è la vedetta sull'albero maestro che segnala una costa nuova nella nebbia; **${vA}** è il cartografo che ne misura i contorni e la rende percorribile per tutti.`
          }
        }
      },
      {
        id: "dir-3-geometry",
        directionNumber: 3,
        directionTitle: `Direzione 3: Prospettiva Semiotica / Di Traduzione`,
        ontologicalAngle: `Mettere a confronto i libri fondativi, i dossier ufficiali e i codici scritti di **${vA}** e **${vB}**, analizzando come due linguaggi apparentemente lontani cerchino di tradurre in parole la stessa realtà profonda.`,
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: "FORMALIZZARE (Fissare il fenomeno in simboli, sigle e protocolli univoci)",
            abstractFunctionA: `I trattati e i dossier tecnici di **${vA}** traducono il mondo in un linguaggio matematico e procedurale, pensato per eliminare ogni ambiguità e permettere a chiunque di replicare l'osservazione.`,
            fundamentalVerbB: "EVOCARE (Restituire attraverso la parola la densità dell'esperienza vissuta)",
            abstractFunctionB: `Le opere e i testi fondativi di **${vB}** utilizzano invece un linguaggio narrativo, simbolico e fenomenologico, perché cercano di descrivere stati e trasformazioni che non possono essere ridotti a una sola formula numerica.`,
            functionalSynthesis: `Mettere insieme il bisogno di **formalizzare** dei testi di **${vA}** e la capacità di **evocare** delle opere di **${vB}** ci permette di superare l'incomprensione linguistica che ha tenuto divisi i due ambiti per decenni.\n\nCome in una stele bilingue, il linguaggio tecnico del primo argomento spiega la struttura meccanica del fenomeno, mentre il linguaggio narrativo del secondo ne restituisce il significato vissuto: letti uno accanto all'altro, i due vocabolari si completano e dicono finalmente la cosa intera.`
          },
          step2BlindAxis: {
            boundaryA: `Il limite dei manuali tecnici di **${vA}** sta nel fatto che, per essere rigorosi, devono lasciare fuori dalla pagina tutto ciò che riguarda il senso, la qualità interiore e la risonanza umana dell'evento.`,
            accessDoorToB: `I testi di **${vB}** iniziano a scrivere proprio sul margine bianco lasciato dai trattati tecnici, dando voce e nome a quell'esperienza qualitativa che i numeri da soli non riescono a raccontare.`,
            creviceContactPoint: `Il punto di contatto tra le due biblioteche si manifesta quando ci accorgiamo che le metafore usate nei testi classici di **${vB}** e i modelli formali introdotti nei trattati di **${vA}** disegnano esattamente la stessa architettura.\n\nIn questa crepa semiotica scopriamo che gli autori dei due campi non stavano parlando di oggetti diversi, ma stavano traducendo in due lingue differenti — quella delle equazioni e quella della coscienza — la medesima legge di trasformazione del reale.`
          },
          step3InvertedDirection: {
            methodAAppliedToB: `Utilizzare il glossario rigoroso dei dossier di **${vA}** per rileggere pagina per pagina i testi fondativi di **${vB}**, verificando a quale processo fisico o biologico corrisponda ogni antica espressione simbolica.`,
            provocativeViolationQuestion: `E se i grandi testi di **${vB}** non fossero racconti allegorici astratti, ma manuali descrittivi precisissimi scritti in una lingua che attendeva solo il vocabolario di **${vA}** per essere decodificata?`,
            counterIntuitiveInsight: `La scoperta sorprendente che nasce da questa traduzione incrociata è che la divisione tra "letteratura dell'esperienza" e "trattato scientifico" è molto più sottile di quanto pensiamo.\n\nQuando sovrapponiamo le pagine dei due archivi, vediamo che i concetti chiave di **${vA}** forniscono la grammatica strutturale che rende trasparenti i testi di **${vB}**, mentre questi ultimi restituiscono ai modelli scientifici quella profondità di significato umano che avevano smarrito.`
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "LA STELE DI ROSETTA DEI DUE SAPERI",
            cosmologicalAnthropologicalGround: `Lo sforzo millenario dell'intelligenza umana di decifrare un'unica realtà attraverso scritture differenti ma convergenti.`,
            unifyingVision: `**${vA}** e **${vB}** sono due iscrizioni incise sulla stessa pietra: solo confrontando i segni dell'una con le parole dell'altra possiamo leggere per intero il messaggio.`
          }
        }
      },
      {
        id: "dir-4-epistemic",
        directionNumber: 4,
        directionTitle: `Direzione 4: Prospettiva Metamorfica / Biologica`,
        ontologicalAngle: `Indagare cosa accade al corpo umano, al sistema nervoso e ai tessuti viventi quando i processi di **${vA}** e le esperienze di **${vB}** si incontrano nella fisiologia concreta dell'osservatore.`,
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: "REGOLARE (Modulare i circuiti molecolari, cellulari e fisiologici)",
            abstractFunctionA: `Dal punto di vista biologico e somatico, **${vA}** interviene sui meccanismi concreti con cui l'organismo mantiene il proprio equilibrio, scambia segnali chimico-elettrici e risponde agli stimoli dell'ambiente.`,
            fundamentalVerbB: "TRASMUTARE (Attraversare un cambiamento profondo di stato percettivo e vitale)",
            abstractFunctionB: `Sul piano dell'esperienza incarnata, **${vB}** coinvolge il corpo come cassa di risonanza capace di modificare i propri ritmi interni — dal respiro alle onde cerebrali — durante gli stati di maggiore apertura e intensità.`,
            functionalSynthesis: `Unire il processo di **regolare** (studiato nei parametri biologici di **${vA}**) e quello di **trasmutare** (vissuto nelle soglie somatiche di **${vB}**) restituisce un'immagine finalmente integra del corpo umano.\n\nLa biologia non è un semplice meccanismo automatico separato dalla vita interiore, e l'esperienza profonda non avviene mai nel vuoto: ogni trasformazione descritta in **${vB}** si appoggia sui circuiti viventi di **${vA}** e, a sua volta, lascia una traccia misurabile nella fisiologia dell'organismo.`
          },
          step2BlindAxis: {
            boundaryA: `L'analisi puramente biomedica di **${vA}** si ferma quando descrive il singolo recettore o il singolo tracciato fisiologico senza riuscire a spiegare come da quel mosaico di cellule nasca il sentimento unitario di presenza e di coscienza.`,
            accessDoorToB: `È proprio a partire da questa unità vissuta in prima persona che si sviluppa **${vB}**, mostrando fin dove può spingersi la plasticità dell'organismo umano quando viene coinvolto nella sua interezza.`,
            creviceContactPoint: `Il punto di contatto biologico tra **${vA}** e **${vB}** risiede nella straordinaria sensibilità del nostro sistema nervoso e cellulare, che funge contemporaneamente da struttura organica e da antenna percettiva.\n\nIn questa soglia somatica, la variazione chimica o bioelettrica misurata dagli strumenti di **${vA}** e il mutamento interiore raccontato in **${vB}** si rivelano come i due lati — esterno e interno — dello stesso atto vitale che attraversa la carne.`
          },
          step3InvertedDirection: {
            methodAAppliedToB: `Monitorare con i biomarcatori e gli strumenti fisiologici di **${vA}** le trasformazioni corporee che accompagnano i fenomeni di **${vB}**, trattando il corpo umano come il vero laboratorio dell'esperimento.`,
            provocativeViolationQuestion: `E se le esperienze più estreme documentate in **${vB}** non fossero allucinazioni che ingannano i sensi, ma l'attivazione di capacità biologiche reali e finora latenti già inscritte nell'architettura di **${vA}**?`,
            counterIntuitiveInsight: `Questa inversione porta alla luce una scoperta decisiva: il corpo umano non è un ostacolo opaco che ci separa dalla comprensione dei fenomeni più sottili, ma è lo strumento più raffinato di cui disponiamo per entrarvi in contatto.\n\nQuando osserviamo i dati di **${vA}** alla luce delle esperienze di **${vB}**, comprendiamo che le nostre cellule e le nostre reti neurali possiedono una flessibilità e una capacità di sintonizzazione molto più ampie di quelle che utilizziamo nella routine quotidiana.`
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "LO STRUMENTO CHE ACCORDA SE STESSO",
            cosmologicalAnthropologicalGround: `La natura singolare dell'essere umano, che nella ricerca della conoscenza è al tempo stesso il musicista, lo spartito e la cassa armonica vibrante.`,
            unifyingVision: `**${vA}** descrive la tensione delle corde e la struttura del legno; **${vB}** è la risonanza musicale che si sprigiona nel corpo quando quelle corde vengono sfiorate.`
          }
        }
      },
      {
        id: "dir-5-ontological",
        directionNumber: 5,
        directionTitle: `Direzione 5: Prospettiva Architetturale / Sistemica`,
        ontologicalAngle: `Confrontare i grandi modelli teorici, i teoremi e i paradigmi di **${vA}** e **${vB}** per cogliere l'architettura complessiva del reale che li comprende entrambi.`,
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: "STRUTTURARE (Definire le leggi e i vincoli che governano le parti del sistema)",
            abstractFunctionA: `I modelli teorici di **${vA}** individuano le regole costanti, le simmetrie e le relazioni causali che permettono di comprendere come funziona e come si regge l'impalcatura osservabile del fenomeno.`,
            fundamentalVerbB: "INTEGRARE (Riconoscere il legame che unisce ogni parte alla totalità del sistema)",
            abstractFunctionB: `Le visioni teoriche di **${vB}** puntano invece a cogliere il disegno d'insieme, mostrando come i singoli eventi locali rispondano a un ordine più vasto e interconnesso.`,
            functionalSynthesis: `La sintesi tra il bisogno di **strutturare** le singole leggi (proprio di **${vA}**) e la capacità di **integrare** il quadro globale (propria di **${vB}**) permette di comprendere l'architettura a più livelli della realtà.\n\nUn modello che guarda solo ai mattoni rischia di non vedere l'edificio; una visione che guarda solo l'insieme rischia di restare astratta. Unendo i paradigmi dei due argomenti, vediamo finalmente come le regole locali del primo livello sostengano e preparino l'emergere del livello successivo.`
          },
          step2BlindAxis: {
            boundaryA: `Ogni teorema o modello formale di **${vA}**, per quanto preciso, arriva a un punto di incompletezza in cui non può spiegare da solo l'origine ultima delle proprie costanti e il ruolo dell'osservatore che lo formula.`,
            accessDoorToB: `I paradigmi di **${vB}** prendono avvio esattamente da questa soglia sistemica, includendo fin dal principio la relazione tra l'osservatore e la totalità del campo indagato.`,
            creviceContactPoint: `Il punto di contatto architettonico tra i due sistemi teorici si trova là dove le equazioni e i modelli di **${vA}** lasciano intravedere una struttura aperta e non-locale che coincide con le intuizioni centrali di **${vB}**.\n\nIn questa cerniera sistemica cade l'idea che esistano due realtà separate: il modello rigoroso del primo argomento e la visione unitaria del secondo si incastrano come due piani consecutivi dello stesso edificio conoscitivo.`
          },
          step3InvertedDirection: {
            methodAAppliedToB: `Impiegare il rigore logico e sistemico dei teoremi di **${vA}** per verificare la tenuta e le conseguenze operative dei modelli unitari proposti in **${vB}**.`,
            provocativeViolationQuestion: `E se i modelli teorici di **${vA}** e i paradigmi di **${vB}** fossero due sezioni complementari di un'unica teoria generale che finora avevamo letto solo a metà?`,
            counterIntuitiveInsight: `Dall'incontro tra le due architetture teoriche nasce una comprensione limpida e profonda: ciò che chiamiamo "limite della scienza" e ciò che chiamiamo "mistero dell'esperienza" non sono due muri contrapposti, ma i due archi che sorreggono la stessa volta.\n\nI teoremi di **${vA}** dimostrano che la realtà fisica è molto più aperta e interconnessa di un semplice meccanismo a orologeria, mentre i modelli di **${vB}** trovano in quella stessa apertura la propria base razionale e condivisibile.`
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "I DUE ARCHI DELLA STESSA VOLTA",
            cosmologicalAnthropologicalGround: `La scoperta che le grandi costruzioni del pensiero umano reggono solo quando due spinte opposte si incontrano in una chiave di volta comune.`,
            unifyingVision: `**${vA}** e **${vB}** salgono da due pilastri opposti dell'esperienza umana, ma convergono al centro per chiudere in equilibrio l'arco della nostra comprensione del mondo.`
          }
        }
      }
    ]
  };
}
