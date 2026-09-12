import { Phase2LoopFiveDirections } from '../types';

/**
 * Fase 2.2: Loop Fase a 5 Direzioni.
 * Applica la Fase 2, attraverso lo stesso identico binario concettuale con cinque angolazioni differenti,
 * costringendo il protocollo dei 4 passaggi a girare a vuoto in cerca di attriti sempre nuovi,
 * svelando cinque diverse faglie ontologiche.
 */
export function buildPhase2LoopFiveDirections(vectorAName: string, vectorBName: string): Phase2LoopFiveDirections {
  const normA = vectorAName.toUpperCase();
  const normB = vectorBName.toUpperCase();

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
  return {
    theoreticalPreamble: `Il protocollo dei 4 passaggi viene applicato a vuoto sul binario concettuale formato da ${vectorAName} e ${vectorBName} lungo cinque direzioni angolari complementari, rivelando cinque fratture ontologiche distinte e inaspettate.`,
    tracks: [
      {
        id: "dir-1-transduction",
        directionNumber: 1,
        directionTitle: `Angolazione 1: La Faglia della Trasduzione Meccanica (${vectorAName} come Soglia Fisica)`,
        ontologicalAngle: "Scomporre l'interfaccia biologica o materiale come filtro di frequenza rispetto alla continuità del campo.",
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: "TRASPORRE (Modulare un gradiente locale)",
            abstractFunctionA: `Sul piano astratto, ${vectorAName} funge da barriera o selettore di banda per la percezione ordinaria.`,
            fundamentalVerbB: "PERSISTERE (Trattenere informazione oltre la soglia)",
            abstractFunctionB: `Sul piano astratto, ${vectorBName} esprime lo stato del segnale quando il selettore locale cessa di operare.`,
            functionalSynthesis: "La collisione mostra come il limite del dispositivo locale definisca le proprietà apparenti del campo esteso."
          },
          step2BlindAxis: {
            boundaryA: `Il limite insuperabile di ${vectorAName} è il proprio supporto materiale.`,
            accessDoorToB: `È proprio il collasso di questo supporto a inaugurare la fenomenologia di ${vectorBName}.`,
            creviceContactPoint: "La crepa: la soglia di transizione di fase in cui la materia perde stabilità e rilascia la configurazione coerente."
          },
          step3InvertedDirection: {
            methodAAppliedToB: `Applicare le leggi interne di ${vectorAName} per decifrare lo spazio di ${vectorBName}.`,
            provocativeViolationQuestion: `E se ${vectorBName} fosse solo l'immagine a specchio generata dal filtro di ${vectorAName} quando viene portato alla saturazione?`,
            counterIntuitiveInsight: "La separazione tra i due mondi non è ontologica ma funzionale: una questione di calibrazione dell'apparato sensibile."
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "IL PRISMA CHE SCOMPONE IL BIANCO",
            cosmologicalAnthropologicalGround: "La costante umana di scambiare il colore isolato dal prisma per la luce nella sua interezza.",
            unifyingVision: "L'esperienza incarnata è un raggio rifratto; la totalità è la luce non deflessa che continua ad attraversare il vuoto."
          }
        }
      },
      {
        id: "dir-2-entropy",
        directionNumber: 2,
        directionTitle: `Angolazione 2: La Faglia Termodinamico-Entropica (Dissipazione vs Conservazione)`,
        ontologicalAngle: "Indagare come il consumo di energia biologica condizioni la permanenza della memoria nel sistema.",
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: "CONSUMARE (Estrarre lavoro dal disordine termico)",
            abstractFunctionA: "Mantenere uno stato stazionario lontano dall'equilibrio attraverso cicli bioenergetici continui.",
            fundamentalVerbB: "CRISTALLIZZARE (Sottrarre l'informazione al flusso temporale)",
            abstractFunctionB: "Uno stato di coerenza asintotica in cui non si consuma carburante organico.",
            functionalSynthesis: "Collisione tra il dinamismo dissipativo del vivente e l'invarianza del dominio atemporale."
          },
          step2BlindAxis: {
            boundaryA: "L'azzeramento del gradiente termico arresta ogni operazione locale.",
            accessDoorToB: "La persistenza non-locale comincia quando l'entropia locale raggiunge il suo massimo relativo.",
            creviceContactPoint: "Il rilascio improvviso di entropia come scintilla d'apertura al dominio informazionale globale."
          },
          step3InvertedDirection: {
            methodAAppliedToB: "Trattare l'eternità come un processo a consumo neghentropico continuo.",
            provocativeViolationQuestion: `E se la dimensione di ${vectorBName} richiedesse un continuo lavoro termodinamico compiuto da chi abita il versante di ${vectorAName}?`,
            counterIntuitiveInsight: "Non sono i vivi a dipendere dai morti o l'effetto dalla causa, ma il campo atemporale a nutrirsi della frizione materiale generata dai corpi in transito."
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "LA CLESSIDRA SENZA FONDO",
            cosmologicalAnthropologicalGround: "La percezione dell'inesorabile scorrere dei grani e il sogno della loro risalita spontanea.",
            unifyingVision: "Il tempo è la caduta del grano; la coscienza è il vetro che racchiude sia il grano che cade sia lo spazio vuoto lasciato sopra."
          }
        }
      },
      {
        id: "dir-3-geometry",
        directionNumber: 3,
        directionTitle: `Angolazione 3: La Faglia Topologica (La Dimensione Confinata vs Lo Spazio di Fase)`,
        ontologicalAngle: "Scomporre i limiti della tridimensionalità euclidea rispetto a una geometria a n-dimensioni.",
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: "CONFINARE (Rinchiudere la dinamica in un volume euclideo chiuso)",
            abstractFunctionA: "Definire un dentro e un fuori protetti da una membrana impermeabile.",
            fundamentalVerbB: "DIFFONDERE (Operare su un fibrato topologico non orientabile)",
            abstractFunctionB: "La simultaneità di tutti i punti in un dominio privo di coordinate estrinseche.",
            functionalSynthesis: "Collisione tra la scatola solida e il nastro di Möbius che ne annulla i confini."
          },
          step2BlindAxis: {
            boundaryA: "L'impossibilità di trovarsi in due punti dello spazio nello stesso istante.",
            accessDoorToB: "L'ubiquità del segnale che non necessita di propagazione metrica nel vuoto.",
            creviceContactPoint: "La singolarità centrale: il punto in cui la curvatura del confinamento si rompe e sfocia nell'iperspazio relazionale."
          },
          step3InvertedDirection: {
            methodAAppliedToB: "Applicare il righello euclideo per misurare le distanze tra le regioni dell'invisibile.",
            provocativeViolationQuestion: `E se lo spazio tra due corpi fosse più denso e vivo della materia che li compone, rendendo ${vectorAName} un'assenza e ${vectorBName} la vera pienezza?`,
            counterIntuitiveInsight: "La materia solida è una bolla d'aria immersa nell'oceano compatto dell'invisibile informazionale."
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "LA BOLLA SOTTO IL MARE",
            cosmologicalAnthropologicalGround: "La paura del vuoto trasformata nella comprensione che siamo noi a vivere nella cavità protetta.",
            unifyingVision: "Abitiamo un'intercapedine gassosa effimera: crediamo che il mare sia fuori, ma la bolla esiste solo perché la pressione circostante la sostiene."
          }
        }
      },
      {
        id: "dir-4-epistemic",
        directionNumber: 4,
        directionTitle: `Angolazione 4: La Faglia Epistemologica (Il Misurabile vs L'Incommensurabile)`,
        ontologicalAngle: "La collisione tra i protocolli di validazione quantitativa e la natura inafferrabile dell'evento singolare.",
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: "QUANTIFICARE (Ridurre l'evento a una sequenza scalare ripetibile)",
            abstractFunctionA: "Rendere l'oggetto manipolabile attraverso la perdita deliberata delle sue qualità uniche.",
            fundamentalVerbB: "SIGNIFICARE (Trasmettere un senso qualitativo irriducibile a cifra)",
            abstractFunctionB: "La valenza simbolica che trasforma un rumore di fondo in una rivelazione per il soggetto.",
            functionalSynthesis: "Collisione tra il numero che pesa e la parola che illumina."
          },
          step2BlindAxis: {
            boundaryA: "Lo strumento scientifico si spegne di fronte all'evento non riproducibile a comando.",
            accessDoorToB: "La dimensione inesplorata si manifesta proprio nell'anomalia unica e irripetibile che viola la gaussiana.",
            creviceContactPoint: "La deviazione standard estrema: l'istante in cui la statistica fallisce e si apre l'intuizione del significato."
          },
          step3InvertedDirection: {
            methodAAppliedToB: "Costruire un laboratorio cieco per costringere il mistero a rispondere a comando.",
            provocativeViolationQuestion: `E se la realtà rifiutasse di farsi misurare non per debolezza dei nostri strumenti, ma perché la misurazione stessa uccide la relazione che la genera?`,
            counterIntuitiveInsight: "L'oggettività scientifica non rivela il mondo: rivela semplicemente come appare il mondo quando decidiamo di non amarlo e di non toccarlo."
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "LA MANO CHE SERRA L'ACQUA",
            cosmologicalAnthropologicalGround: "La tentazione prometeica di possedere il flusso serrando le dita, scoprendo che l'acqua sfugge tra le nocche.",
            unifyingVision: "Per trattenere l'essenza non bisogna chiudere il pugno, ma trasformare la mano in una conca accogliente in cui il riflesso può posarsi."
          }
        }
      },
      {
        id: "dir-5-ontological",
        directionNumber: 5,
        directionTitle: `Angolazione 5: La Faglia Ontologico-Esistenziale (La Maschera della Forma vs L'Abisso del Fondamento)`,
        ontologicalAngle: "Il confronto ultimo tra la finitudine dell'ente individuale e l'abisso impersonale dell'essere.",
        collision: {
          step1StrippingFunction: {
            fundamentalVerbA: "INDIVIDUALIZZARE (Tracciare un contorno identitario netto nel continuum)",
            abstractFunctionA: "Costruire un'identità autonoma che dice 'io' e si difende dalla dispersione nel tutto.",
            fundamentalVerbB: "UNIVERSALIZZARE (Riconoscere l'identità originaria della parte col tutto)",
            abstractFunctionB: "La de-centrazione radicale in cui ogni contorno si scopre provvisorio e convenzionale.",
            functionalSynthesis: "Collisione tra l'istinto di autoconservazione della goccia e la vastità indistruttibile dell'oceano."
          },
          step2BlindAxis: {
            boundaryA: "La caducità insuperabile del nome e della memoria biografica individuale.",
            accessDoorToB: "L'accesso alla dimensione eterna attraverso la destrutturazione dell'io autobiografico.",
            creviceContactPoint: "Il punto zero dell'identità: l'istante supremo di resa in cui la goccia tocca l'acqua e non sa più dove finisce se stessa."
          },
          step3InvertedDirection: {
            methodAAppliedToB: "Trattare l'infinito come una proprietà privata da recintare e gestire burocraticamente.",
            provocativeViolationQuestion: `E se la nostra individualità non fosse un fine dell'evoluzione, ma un errore ottico necessario affinché l'Assoluto possa sperimentare la nostalgia di se stesso?`,
            counterIntuitiveInsight: "Non siamo noi che cerchiamo di raggiungere l'invisibile: è l'invisibile che ha inventato i nostri corpi per potersi guardare da fuori per una frazione di secondo."
          },
          step4CommonMetaphor: {
            masterMetaphorTitle: "IL TEATRO DELL'ATTORE SOLITARIO",
            cosmologicalAnthropologicalGround: "La consapevolezza che dietro tutte le maschere indossate sulla scena batte un unico respiro.",
            unifyingVision: "Siamo un unico attore che recita tutte le parti: colui che modifica il codice e colui che parla dal silenzio della radio sono la medesima voce che si scambia il copione nel buio del retropalco."
          }
        }
      }
    ]
  };
}
