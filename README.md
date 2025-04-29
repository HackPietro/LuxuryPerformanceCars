Durante il periodo di Tirocinio presso l'Unical, l’attenzione è stata focalizzata sulla realizzazione di uno strumento innovativo per l’analisi dei dati, diverso da quanto già preesistente nel mercato online. Il progetto sviluppato infatti non si limita a fornire un semplice strumento di analisi, ma mira a creare un sistema ancora più avanzato e dettagliato, in grado di offrire informazioni strategiche e mirate per il settore di riferimento. In particolare, l’area di applicazione scelta è stata il settore automotive, un ambito in costante trasformazione, caratterizzato da sfide sempre più complesse e da un mercato altamente competitivo. Negli ultimi anni, la compravendita di autovetture nuove e usate ha assunto una dimensione fortemente digitale: oggi, il primo passo di un potenziale acquirente non è più legato allo spostamento fisico verso una concessionaria, ma ci si orienta verso la ricerca virtuale di informazioni e offerte da confrontare direttamente online. In questo contesto, per un’azienda, diventa fondamenta le comprendere quali siano le caratteristiche più ricercate dagli utenti, quali modelli attirino maggiore interesse e quali, invece, riscuotano meno successo. L’obiettivo del progetto è stato, quindi, lo sviluppo di uno strumento di analisi dei dati, mirato specificamente alla vendita di autovetture. Il sistema è stato progettato per raccogliere e interpretare informazioni strategiche come, per esempio, le caratteristiche delle auto più ricercate, le fasce di prezzo più richieste e i modelli con maggiore o minore attrazione sul mercato. Un ulteriore valore aggiunto del progetto è stato l’integrazione di funzionalità predittive: basandosi sullo storico dei dati raccolti, lo strumento è infatti in grado di stimare il potenziale successo di vendita di un’auto fornendo così agli operatori del settore un aiuto concreto per ottimizzare le proprie strategie di mercato. Grazie a questa innovazione, il sistema non si limita a descrivere il comportamento degli utenti, ma offre anche previsioni utili per migliorare la gestione delle vendite e l’adattamento alle tendenze del mercato. 

L’applicazione web sviluppata ha la finalità di aiutare l’utente ad avere un’esperienza di ricerca delle auto fluida e ottimizzata per ogni esigenza e d’altra parte aiutare l’amministratore del sistema a studiare i dati e dare una sorta di visione delle azioni dell’utente in modo da capire le richieste e soddisfarli nel tempo con auto inserite nel parco auto del concessionario sempre di loro interesse. L’utente avrà la possibilità di ricercare un’auto con una ricerca avanzata che include tutti i parametri di ricerca di un’auto. Si potrà ricercare tramite un solo parametro o tramite più parametri in modo da avere un risultato molto più coerente alle richieste dell’utente. L’amministratore invece avrà due sezioni dedicate speciali. La prima quella dell’analisi dei dati nonchè l’analisi dei dati raccolti tramite le azioni degli utenti: l’analisi sarà un insieme di dati raccolti, elaborati e resi visibili tramite diagrammi e grafici di vario genere adatti precisamente alle visualizzazioni del risultato dell’elaborazione. La seconda sezione è quella del calcolo della probabilità di vendita di un’auto: l’amministratore potrà inserire tutti i dati di un’auto che ha intenzione di acquistare per la vendita e tramite i dati raccolti ed elaborati dalle azioni degli utenti, auto vendute e altro, l’algoritmo di Machine Learning addestrato e sviluppato appositamente per il tipo di calcolo da effettuare, calcolerà una probabilità di vendita di quell’auto espressa in percentuale, oltre a ricreare una dettagliata tabella con i dati che hanno influenzato positivamente e negativamente la percentuale.

# Utilizzo del sistema

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Home.png)

Entrati nell’applicazione web, ci troviamo nella schermata Home, dove:
  - Con il tasto in basso "Vai al Parco Auto" si accede alla sezione Parco Auto.
  - Con il tasto in alto a destra si entra nella sezione Gestione Account, dove le operazioni variano in base alla tipologia dell’utente loggato.
  - Se l’utente è loggato, appare un terzo tasto che permette l’accesso alla Wishlist personale.

Cliccando su "Vai al Parco Auto", si accede alla sezione di visualizzazione di tutte le auto disponibili nel concessionario.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Parco%20Auto.png)

In questa sezione (fig. 5.2) è possibile vedere tutti gli annunci delle auto in vendita. Ogni annuncio è composto da:
• Una foto del veicolo;
• Alcune informazioni principali;
• Il prezzo di vendita.

Nella barra superiore sono presenti:
• Il numero di annunci visualizzati (variabile in base a una ricerca);
• Il tasto "Ricerca Avanzata" per filtrare le auto con uno o più parametri;
• Un menù per ordinare gli annunci alfabeticamente o per prezzo (crescente o decrescente).

Cliccando su "Ricerca Avanzata", si apre la sezione di inserimento dei parametri di ricerca (fig. 5.3).

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Ricerca%20Avanzata.png)

Si possono cercare auto per diversi parametri o combinazioni, come:
• Prezzo massimo
• Chilometraggio minimo
• Altro

Cliccando su "Cerca", il parco auto si aggiornerà mostrando solo le auto che soddisfano i criteri selezionati.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Auto.png)

Ogni annuncio (fig. 5.4) include:
• Una o più foto del veicolo per valutarne lo stato e le caratteristiche;
• Dettagli tecnici, descrizione e prezzo di vendita;
• Pulsanti per aggiungere alla Wishlist e condividere l’annuncio.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Auto%20Correlate.png)

Nella parte inferiore (fig. 5.5) sono visibili alcune auto correlate con caratteristiche simili. Cliccando su un’auto correlata, si aprirà una nuova scheda con i dettagli relativi.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Wishlist.png)

Nella sezione Wishlist (fig. 5.6) è possibile:
• Visualizzare tutte le auto salvate;
• Eliminare una singola auto o svuotare la Wishlist;
• Tornare alla scheda dell’auto selezionata cliccando sulla foto del veicolo.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Home2.png)

Dalla schermata home (fig. 5.7):
• Un utente normale può modificare i propri dati o effettuare il log-out;
• Un amministratore ha accesso a tre sezioni aggiuntive:
  – Gestione Utenti
  – Gestione Auto
  – Analisi Dati

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Gestione%20Utenti.png)

Come possiamo vedere dalla Figura 5.8, l’amministratore può:
• Eliminare un utente;
• Modificare il ruolo di un utente (utente normale o amministratore)

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Gestione%20Auto.png)

Nella Figura 5.9 possiamo vedere come l’amministratore può:
• Eliminare un annuncio tramite il suo ID;
• Segnare un’auto come venduta tramite il suo ID;
• Copiare i dati di un’auto già inserita per creare un nuovo annuncio;
• Aggiungere un nuovo annuncio compilando tutti i campi richiesti;
• Calcolare la probabilità di vendita di un’auto.

Inseriti come da Figura 5.9 i dettagli dell’auto che il concessionario vuole acquistare per la rivendita (una Fiat 500, utilitaria del 2013 con motore 1.2 benzina, cambio manuale, 3 porte, adatta ai neopatentati e con 178.000 km, al prezzo di 7.500 euro), possiamo calcolarne la probabilità di vendita per capire se quest’auto, in base allo storico delle auto vendute dal concessionario e dati presenti nel database, potrà essere rivenduta con facilità.

Calcolata la probabilità di successo di vendita, il dato sarà espresso in percentuale e tutti i dati che hanno contribuito positivamente o negativamente al calcolo della percentuale appariranno di colore verde o rosso nella tabella.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Calcolo%20Probabilità%20di%20Vendita.png)

Nella Figura 5.10 viene mostrato in formato tabellare il confronto tra i dati inseriti e i valori attesi:
• Anno: atteso tra il 2015 e il 2021, l’auto è del 2013, quindi risultato negativo
• Cambio: atteso manuale, l’auto ha un cambio manuale, quindi risultato positivo
• Adatta a neopatentati: atteso sì, l’auto è adatta a neopatentati, quindi risultato positivo
• Numero di porte: atteso 5, l’auto ha 3 porte, quindi risultato negativo
• Alimentazione: atteso Benzina, l’auto è Benzina, quindi risultato positivo
• Chilometraggio: atteso tra 62.849 km e 85.031 km, l’auto ha 178.000 km, quindi risultato negativo
• Prezzo: atteso tra 8.396 euro e 11.360 euro, l’auto ha un prezzo di 7.500 euro (più conveniente), quindi risultato positivo
• Cilindrata: attese motorizzazioni 1.0 o 1.2, l’auto è 1.2, quindi valore positivo

Dati questi risultati, si registrano 5 positivi contro 3 negativi e, calcolati in percentuale, la probabilità di vendita risulta del 62,50%. Essendo superiore al 50%, l’auto potrebbe essere rivenduta con successo dal concessionario.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%200.png)

L’amministratore può accedere alla sezione di Analisi Dati (fig. 5.11), che include vari grafici per:
• Analisi delle ricerche effettuate dagli utenti;
• Analisi delle visite agli annunci;
• Altre metriche sulle performance degli annunci e sulle ricerche.

Ogni grafico è ottimizzato in base al tipo di analisi richiesta.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%201.png)

La Figura 5.12 mostra l’analisi delle ricerche effettuate dagli utenti in base ai prezzi minimi desiderati per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%202.png)

La Figura 5.13 mostra l’analisi delle ricerche effettuate dagli utenti in base ai prezzi massimi desiderati per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%203.png)

La Figura 5.14 mostra l’analisi delle ricerche effettuate dagli utenti in base al numero di porte desiderate per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%204.png)

La Figura 5.15 mostra l’analisi delle ricerche effettuate dagli utenti di auto per neopatentati.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%205.png)

La Figura 5.16 mostra l’analisi delle ricerche effettuate dagli utenti in base alle marche di auto più desiderate.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%206.png)

La Figura 5.17 mostra l’analisi delle ricerche effettuate dagli utenti in base ai modelli più desiderati di una determinata marca.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%207.png)

La Figura 5.18 mostra l’analisi delle ricerche effettuate dagli utenti in base ai kilometri minimi desiderati per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%208.png)

La Figura 5.19 mostra l’analisi delle ricerche effettuate dagli utenti in base ai kilometri massimi desiderati per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%209.png)

La Figura 5.20 mostra l’analisi delle ricerche effettuate dagli utenti in base agli anni di immatricolazione minimi desiderati per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%2010.png)

La Figura 5.21 mostra l’analisi delle ricerche effettuate dagli utenti in base agli anni di immatricolazione massimi desiderati per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%2011.png)

La Figura 5.22 mostra l’analisi delle ricerche effettuate dagli utenti in base ai tipi di cambio desiderati per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%2012.png)

La Figura 5.23 mostra l’analisi delle ricerche effettuate dagli utenti in base ai tipi di carburante desiderati per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%2013.png)

La Figura 5.24 mostra l’analisi delle ricerche effettuate dagli utenti in base alle categorie di auto desiderate per l’acquisto di un’auto.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%2014.png)

La Figura 5.25 mostra un grafico contenente il numero di click raggiunto da ogni annuncio presente nell’applicazione web.

![](https://github.com/HackPietro/LuxuryPerformanceCars/blob/main/Immagini/Analisi%20dei%20dati%2015.png)

La Figura 5.26 mostra un grafico contenente l’andamento delle probabilità di vendita espresse in percentuali di un determinato modello di auto.
