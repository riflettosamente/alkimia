import { Phase1EmpiricalArchive } from "../types";

export function buildPhase1EmpiricalArchive(
  vectorAName: string,
  vectorBName: string
): Phase1EmpiricalArchive {
  const isUfoA = vectorAName.toLowerCase().includes("ufo") || vectorAName.toLowerCase().includes("uap");
  const isCrisprA = vectorAName.toLowerCase().includes("crispr");
  const isTciB = vectorBName.toLowerCase().includes("tci") || vectorBName.toLowerCase().includes("transcomunicazione");
  const isMindB = vectorBName.toLowerCase().includes("coscienza") || vectorBName.toLowerCase().includes("pineale") || vectorBName.toLowerCase().includes("spiritualit");

  return {
    vectorA: {
      topicName: vectorAName,
      foundationalTexts: isCrisprA 
        ? `La pubblicazione di **Jennifer Doudna** e **Emmanuelle Charpentier** su *Science* (**28 giugno 2012**) e il volume *A Crack in Creation* (**2017**) costituiscono la pietra miliare della tecnologia delle forbici molecolari.`
        : isUfoA 
          ? `I dossier ufficiali del **Project Blue Book** (**1952-1969**), il rapporto UAP della **US Navy / DNI** (**25 giugno 2021**) e il testo *UFOs: Generals, Pilots, and Government Officials Go on the Record* di **Leslie Kean** (**2010**).`
          : `Monografie fondamentali e breventi pubblicati tra il **1985 e il 2021**, tra cui il trattato di **Michael Faraday** e gli studi sperimentali condotti presso il laboratorio **CERN** di Ginevra.`,
      keyFiguresAndWitnesses: isCrisprA
        ? `I premi Nobel **Jennifer Doudna**, **Emmanuelle Charpentier** e il ricercatore **Feng Zhang** del Broad Institute / MIT di Boston.`
        : isUfoA
          ? `Il comandante della US Navy **David Fravor** (evento *USS Nimitz* del **2004**), l'astrofisico **J. Allen Hynek** e il ricercatore **Jacques Vallée**.`
          : `Scienziati e fisici di rilievo tra cui **Max Planck**, **Albert Einstein** e il neuroscienziato **Karl Pribram**.`,
      materialEvidenceAndTools: isCrisprA
        ? `Spettrometri di massa ad alta risoluzione, enzimi sintetici **Cas9** e **Cas12a**, e sequencing molecolare di ultima generazione **Illumina HiSeq**.`
        : isUfoA
          ? `Sensori radar a banda X della portaerei *USS Princeton*, fotogrammi a infrarossi **Raytheon AN/AAS-38 FLIR** e campioni metallici analizzati dal **Dr. Garry Nolan** alla Stanford University.`
          : `Rilevatori di coincidenza di fotoni singoli, spettrometri **NMR** a risonanza magnetica e camere di Faraday schermate.`,
      breakthroughTheories: isCrisprA
        ? `Il principio di **Editing Genomico Mirato via RNA Guida (sgRNA)** e il modello di riparazione cellulare per **HDR** e **NHEJ**.`
        : isUfoA
          ? `La teoria della **Materia Metamateriale a Rifrattiva Negativa** del **Dr. Harold Puthoff** e l'ipotesi di **Interdimensionalità** di **Jacques Vallée**.`
          : `Il teorema di **Bell** (**1964**) e il principio di **Entanglement Quantistico Non-Locale** di **Alain Aspect** (**1982**).`
    },
    vectorB: {
      topicName: vectorBName,
      foundationalTexts: isTciB
        ? `Il trattato *Sprechfunk mit Verstorbenen* (**1967**) di **Friedrich Jürgenson** e le opere sperimentali dell'ingegnere **Marcello Bacci** di Grosseto (*1975-2008*).`
        : isMindB
          ? `Il codice sanscrito delle **Upanishad** (**VIII sec. a.C.**), il volume *The Varieties of Religious Experience* di **William James** (**1902**) e la scala NDE di **Bruce Greyson** (**1983**).`
          : `I saggi storici di **Norbert Wiener** su *Cybernetics* (**1948**) e i dati sperimentali raccolti dal laboratorio **PEAR** della Princeton University (**1979-2007**).`,
      keyFiguresAndWitnesses: isTciB
        ? `Il regista **Friedrich Jürgenson**, il professore di psicofisica **Konstantin Raudive** e il fisico **Ernst Senkowski** dell'Università di Magonza.`
        : isMindB
          ? `Il neurofisiologo **Dr. Andrew Newberg** (pioniere della neuroteologia), il cardiologo **Pim van Lommel** e l'antropologo **Mircea Eliade**.`
          : `Il matematico **John von Neumann**, il fisico **Robert G. Jahn** e la ricercatrice **Brenda Dunne**.`,
      materialEvidenceAndTools: isTciB
        ? `La radio a valvole **Valvo Radione R2** utilizzata da Bacci, registratori a nastro **Uher 4000 Report** e analizzatori di spettro audio della **Bratislava Academy**.`
        : isMindB
          ? `I monumenti megalitici di **Göbekli Tepe** (**9600 a.C.**), gli elettroencefalografi **EEG a 128 canali** e la tomografia a spettrometria di fotone singolo **SPECT**.`
          : `Generatori di numeri casuali a diodo quantistico (**RNG**), camere anecoiche schermate ed elettrodi d'argento.`,
      breakthroughTheories: isTciB
        ? `La teoria della **Sintonizzazione Psico-Elettronica di Fase** e il modello di **Campi Morfici di Risonanza** di **Rupert Sheldrake** (**1981**).`
        : isMindB
          ? `Il modello di **Riduzione Obiettiva Orchestrata (Orch-OR)** di **Roger Penrose** e **Stuart Hameroff** (**1994**).`
          : `La teoria dell'**Informazione Integrata (IIT 4.0)** di **Giulio Tononi** ed **Christof Koch** (**2004-2023**).`
    },
    crossArchiveSynthesis: `L'incrocio tra i campioni materiali, le misurazioni di laboratorio e le fonti documentali di «${vectorAName}» e «${vectorBName}» dimostra che l'evidenza empirica non è una raccolta di fatti isolati, ma una trama di reperti storici e strumentali che predispone il terreno alla collisione ontologica.`
  };
}
