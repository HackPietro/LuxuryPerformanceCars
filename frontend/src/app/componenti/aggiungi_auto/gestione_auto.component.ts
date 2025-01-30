import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ServiceService } from '../../Service/service';
import { MatDialog } from '@angular/material/dialog';
import { NgxImageCompressService } from 'ngx-image-compress';
import {
  Dati_successo_probabilita_venditaComponent
} from "../dati_successo_probabilita_vendita/dati_successo_probabilita_vendita.component";


@Component({
  selector: 'app-aggiungi_auto',
  templateUrl: './gestione_auto.component.html',
  styleUrls: ['./gestione_auto.component.css']
})
export class Gestione_autoComponent implements OnInit {
  public formAggiungiAuto: FormGroup = new FormGroup({});
  formAggiornaPercentualiAuto: FormGroup = new FormGroup({});

  public images: string[] = [];
  public autoExists: boolean = false;
  public selectedAutoId: number = 0;
  public successProbability: number = 0;

  private autoList: any[] = [];


  constructor(
    private service: ServiceService,
    public dialog: MatDialog,
    private compressImage: NgxImageCompressService,
    private fb: FormBuilder

) {
    this.formAggiornaPercentualiAuto = this.fb.group({
      categoria: [''],
      marca: [''],
      modello: [''],
      anno: [''],
      carburante: [''],
      chilometraggio: [''],
      cilindrata: [''],
      prezzo: [''],
      porte: [''],
      neopatentati: [false],
      descrizione: [''],
      cambio: ['']
    });
  }

  ngOnInit(): void {
    this.formAggiungiAuto = new FormGroup({
      id: new FormControl(),
      copyId: new FormControl(),
      categoria: new FormControl(),
      marca: new FormControl(),
      modello: new FormControl(),
      anno: new FormControl(),
      carburante: new FormControl(),
      chilometraggio: new FormControl(),
      cilindrata: new FormControl(),
      prezzo: new FormControl(),
      porte: new FormControl(),
      neopatentati: new FormControl(),
      descrizione: new FormControl(),
      cambio: new FormControl()
    });

    this.service.findAllAuto().subscribe((data) => {
      this.autoList = data;
    });
  }

  // Funzione per copiare i dati dell'auto esistente
  onCopyIdChange(): void {
    const copyId = this.formAggiungiAuto.value.copyId; // Ottieni il valore di "copyId" dal form

    // Verifica se l'ID non è vuoto e se è un numero valido
    if (copyId && !isNaN(copyId)) {
      this.service.getAutoById(copyId).subscribe({
        next: (autoData) => {
          // Se l'auto esiste, aggiorna i campi del form
          if (autoData) {
            this.formAggiungiAuto.patchValue({
              categoria: autoData.categoria,
              marca: autoData.marca,
              modello: autoData.modello,
              anno: autoData.anno,
              carburante: autoData.carburante,
              chilometraggio: autoData.chilometraggio,
              cilindrata: autoData.cilindrata,
              prezzo: autoData.prezzo,
              porte: autoData.porte,
              neopatentati: autoData.neopatentati,
              descrizione: autoData.descrizione,
              cambio: autoData.cambio
            });
            this.autoExists = true; // Impostiamo il flag per sapere che l'auto esiste
          }
        },
        error: (error) => {
          console.error('Errore nel recupero dell\'auto', error);
          window.alert('Non è stato possibile recuperare i dati dell\'auto.');
        }
      });
    } else {
      this.autoExists = false; // Se l'ID non è valido, resettiamo il flag
    }
  }


  // Funzione per rimuovere l'auto
  deleteAuto(): void {
    const autoId = this.formAggiungiAuto.value.id;

    // Controlla se l'ID è presente prima di procedere con la rimozione
    if (autoId) {
      this.service.updateDisponibilitaAuto(autoId,false).subscribe({
        next: (response) => {
          window.alert('Auto eliminata con successo');
          this.service.getAutoById(autoId).subscribe({
            next: (autoData) => {
              // Assicurati che l'auto esista prima di cercare la categoria
              if (autoData) {
                const categoriaAutoEliminata = autoData.categoria;
                this.caricaDatiAutoDisponibili(categoriaAutoEliminata); // carica i dati delle auto disponibili
              } else {
                window.alert('Auto non trovata');
              }
            },
            error: (error) => {
              console.error('Errore nel recupero dei dati dell\'auto', error);
            }
          });
          this.service.deleteImmagineAuto(autoId).subscribe({
            next: () => {
              console.log('Immagini associate all\'auto eliminate con successo.');
            },
            error: (error) => {
              console.error('Errore durante l\'eliminazione delle immagini', error);
            }
          });
        },
        error: (error) => {
          console.error('Errore durante l\'eliminazione dell\'auto', error);
        }
      });
    } else {
      alert('ID auto non valido!');
    }
  }

  // Funzione per aggiungere l'auto
  addAuto(): void {
    const auto = {...this.formAggiungiAuto.value};

    this.service.addAuto(auto).subscribe((response) => {
      // Se ci sono immagini, le aggiungiamo una alla volta
      if (this.images.length > 0) {
        this.images.forEach(image => {
          const immagine = {autoId: response.id, immagineBase64: image};
          this.service.addImmagineAuto(immagine).subscribe(() => {
            console.log('Immagine aggiunta con successo');
          }, error => {
            console.error('Errore nell\'aggiungere l\'immagine', error);
          });
        });
      }
    }, error => {
      window.alert('Errore nell\'aggiungere l\'auto');
    });
  }

  // Funzione per gestire il cambio file (caricamento immagine)
  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      // Per ogni file selezionato
      Array.from(files).forEach(file => {
        // Cast esplicito di "file" a tipo Blob
        const fileBlob = file as Blob;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          let base64String = e.target.result;
          const base64Data = base64String.split(',')[1];
          this.images.push(base64Data);  // Aggiungi ogni immagine all'array
        };

        reader.readAsDataURL(fileBlob);  // Ora TypeScript non segnalerà l'errore
      });
    }
  }


  // Funzione chiamata al click del tasto "Aggiungi"
  onSubmit(): void {
    // Aggiungi direttamente l'auto senza validazioni
    this.addAuto();
  }

  calculateSuccessProbability(): void {
    const formData = this.formAggiungiAuto.value;

    // Filtra le auto non disponibili e con la stessa categoria
    const filteredAutos = this.autoList.filter(
      auto => !auto.disponibile && auto.categoria === formData.categoria
    );
    if (filteredAutos.length === 0) {
      alert('Non ci sono dati sufficienti per calcolare la probabilità di vendita.');
      return;
    }

    // Variabili per accumulare i parametri e una lista per i risultati
    let positiveParams = 0;
    let negativeParams = 0;
    const results: { parametro: string, valoreForm: any, valoreAtteso: any, risultato: string }[] = [];

    // **Anno**
    const avgYear = filteredAutos.reduce((sum, auto) => sum + auto.anno, 0) / filteredAutos.length;
    const minYear = avgYear - 3;
    const maxYear = avgYear + 3;
    const annoResult = formData.anno >= minYear && formData.anno <= maxYear ? 'Positivo' : 'Negativo';
    if (annoResult === 'Positivo') positiveParams++; else negativeParams++;
    results.push({ parametro: 'Anno', valoreForm: formData.anno, valoreAtteso: `${minYear} - ${maxYear}`, risultato: annoResult });

    // **Cambio**
    const cambioCounts: { [cambio: string]: number } = { 'Manuale': 0, 'Automatico': 0 };
    filteredAutos.forEach(auto => cambioCounts[auto.cambio]++);
    const mostSoldCambio = cambioCounts['Manuale'] > cambioCounts['Automatico'] ? 'Manuale' : 'Automatico';
    const cambioResult = formData.cambio === mostSoldCambio ? 'Positivo' : 'Negativo';
    if (cambioResult === 'Positivo') positiveParams++; else negativeParams++;
    results.push({ parametro: 'Cambio', valoreForm: formData.cambio, valoreAtteso: mostSoldCambio, risultato: cambioResult });

    // **Neopatentati**
    const neopatentatiCounts: { [key: string]: number } = { 'true': 0, 'false': 0 };
    filteredAutos.forEach(auto => neopatentatiCounts[auto.neopatentati.toString()]++);
    const mostSoldNeopatentati = neopatentatiCounts['true'] > neopatentatiCounts['false'] ? 'true' : 'false';
    const neopatentatiResult = formData.neopatentati.toString() === mostSoldNeopatentati ? 'Positivo' : 'Negativo';
    if (neopatentatiResult === 'Positivo') positiveParams++; else negativeParams++;
    results.push({
      parametro: 'Neopatentati',
      valoreForm: formData.neopatentati ? 'Sì' : 'No',
      valoreAtteso: mostSoldNeopatentati === 'true' ? 'Sì' : 'No',
      risultato: neopatentatiResult
    });

    // **Porte**
    const porteCounts: { [porte: number]: number } = { 3: 0, 5: 0 };
    filteredAutos.forEach(auto => porteCounts[auto.porte]++);
    const mostSoldPorte = porteCounts[3] > porteCounts[5] ? 3 : 5;
    const porteResult = Number(formData.porte) === mostSoldPorte ? 'Positivo' : 'Negativo';
    if (porteResult === 'Positivo') positiveParams++; else negativeParams++;
    results.push({ parametro: 'Porte', valoreForm: formData.porte, valoreAtteso: mostSoldPorte, risultato: porteResult });

    // **Carburante**
    const carburanteCounts: { [carburante: string]: number } = {};
    filteredAutos.forEach(auto => carburanteCounts[auto.carburante] = (carburanteCounts[auto.carburante] || 0) + 1);
    const maxCarburanteCount = Math.max(...Object.values(carburanteCounts));
    const carburanteCandidates = Object.keys(carburanteCounts).filter(
      carburante => carburanteCounts[carburante] >= maxCarburanteCount * 0.9
    );
    const carburanteResult = carburanteCandidates.includes(formData.carburante) ? 'Positivo' : 'Negativo';
    if (carburanteResult === 'Positivo') positiveParams++; else negativeParams++;
    results.push({ parametro: 'Carburante', valoreForm: formData.carburante, valoreAtteso: carburanteCandidates.join(', '), risultato: carburanteResult });

    // **Chilometraggio**
    const avgKilometers = filteredAutos.reduce((sum, auto) => sum + auto.chilometraggio, 0) / filteredAutos.length;
    const minKilometers = Math.round(avgKilometers * 0.85);
    const maxKilometers = Math.round(avgKilometers * 1.15);
// Modifica logica: valore positivo se formData.chilometraggio è minore di minKilometers
    const chilometraggioResult = formData.chilometraggio < minKilometers ? 'Positivo' : 'Negativo';
    if (chilometraggioResult === 'Positivo') positiveParams++; else negativeParams++;
    results.push({
      parametro: 'Chilometraggio',
      valoreForm: Math.round(formData.chilometraggio),
      valoreAtteso: `${minKilometers} - ${maxKilometers}`,
      risultato: chilometraggioResult
    });

// **Prezzo**
    const avgPrice = filteredAutos.reduce((sum, auto) => sum + auto.prezzo, 0) / filteredAutos.length;
    const minPrice = Math.round(avgPrice * 0.85);
    const maxPrice = Math.round(avgPrice * 1.15);
// Modifica logica: valore positivo se formData.prezzo è minore di minPrice
    const prezzoResult = formData.prezzo < minPrice ? 'Positivo' : 'Negativo';
    if (prezzoResult === 'Positivo') positiveParams++; else negativeParams++;
    results.push({
      parametro: 'Prezzo',
      valoreForm: Math.round(formData.prezzo),
      valoreAtteso: `${minPrice} - ${maxPrice}`,
      risultato: prezzoResult
    });

    // **Cilindrata**
    const cilindrataCounts: { [cilindrata: number]: number } = {};
    filteredAutos.forEach(auto => cilindrataCounts[auto.cilindrata] = (cilindrataCounts[auto.cilindrata] || 0) + 1);
    const maxCilindrataCount = Math.max(...Object.values(cilindrataCounts));
    const cilindrataCandidates = Object.keys(cilindrataCounts)
      .map(key => +key)
      .filter(cilindrata => cilindrataCounts[cilindrata] >= maxCilindrataCount * 0.9);
    const cilindrataResult = cilindrataCandidates.includes(formData.cilindrata) ? 'Positivo' : 'Negativo';
    if (cilindrataResult === 'Positivo') positiveParams++; else negativeParams++;
    results.push({ parametro: 'Cilindrata', valoreForm: formData.cilindrata, valoreAtteso: cilindrataCandidates.join(', '), risultato: cilindrataResult });

    // Calcola la probabilità di successo
    const totalParams = positiveParams + negativeParams;
    if (totalParams === 0) {
      alert('Impossibile calcolare la probabilità: nessun parametro valido.');
      return;
    }

    this.successProbability = (positiveParams / totalParams) * 100;

    // Apri il popup
    this.dialog.open(Dati_successo_probabilita_venditaComponent, {
      width: '600px',
      data: { results, successProbability: this.successProbability.toFixed(2) }
    });
  }


  onCheckProbability(): void {
    this.calculateSuccessProbability();
  }

  caricaDatiAutoDisponibili(categoriaAutoEliminata : string): void {
    // Ottieni il prossimo numero valore
    this.service.getMaxNumeroValore().subscribe({
      next: (numeroValore) => {
        // Procedi con il recupero degli ID delle auto disponibili
        this.service.getAllIdAutoDisponibili().subscribe({
          next: (idAutoDisponibili) => {
            idAutoDisponibili.forEach((id) => {
              this.service.getAutoById(id).subscribe({
                next: (autoData) => {
                  if (autoData) {
                    // Aggiorna i campi del form per ogni auto trovata
                    this.formAggiornaPercentualiAuto.patchValue({
                      categoria: autoData.categoria,
                      marca: autoData.marca,
                      modello: autoData.modello,
                      anno: autoData.anno,
                      carburante: autoData.carburante,
                      chilometraggio: autoData.chilometraggio,
                      cilindrata: autoData.cilindrata,
                      prezzo: autoData.prezzo,
                      porte: autoData.porte,
                      neopatentati: autoData.neopatentati,
                      descrizione: autoData.descrizione,
                      cambio: autoData.cambio
                    });
                    console.log(`Dati auto con ID ${id} caricati correttamente.`);

                    if (autoData.categoria === categoriaAutoEliminata) {
                      this.calculateSuccessProbabilityForIdAuto(id, numeroValore + 1);
                    } else {
                      console.log(`Categoria dell'auto con ID ${id} non corrisponde alla categoria eliminata.`);
                    }
                  }
                },
                error: (err) => {
                  console.error(`Errore durante il recupero dei dati per l'auto con ID ${id}:`, err);
                }
              });
            });
          },
          error: (error) => {
            console.error('Errore durante il recupero degli ID delle auto disponibili:', error);
          }
        });
      },
      error: (err) => {
        console.error('Errore durante il recupero del numero valore:', err);
      }
    });
  }


  calculateSuccessProbabilityForIdAuto(id : number, numeroValore : number): void {
    const formData = this.formAggiornaPercentualiAuto.value;

    // Filtra le auto non disponibili e con la stessa categoria
    const filteredAutos = this.autoList.filter(
      auto => !auto.disponibile && auto.categoria === formData.categoria
    );

    if (filteredAutos.length === 0) {
      alert('Non ci sono dati sufficienti per calcolare la probabilità di vendita.');
      return;
    }

    // Variabili per accumulare il numero di parametri positivi e negativi
    let positiveParams = 0;
    let negativeParams = 0;

    // **Anno - Calcola la media e verifica la tolleranza ±3**
    const avgYear = filteredAutos.reduce((sum, auto) => sum + auto.anno, 0) / filteredAutos.length;
    const minYear = avgYear - 3;
    const maxYear = avgYear + 3;
    if (formData.anno >= minYear && formData.anno <= maxYear) {
      positiveParams++;
    } else {
      negativeParams++;
    }
    // **Cambio - Calcola il più usato tra automatico e manuale**
    const cambioCounts: { [cambio: string]: number } = { 'Manuale': 0, 'Automatico': 0 };
    filteredAutos.forEach(auto => {
      if (auto.cambio === 'Manuale' || auto.cambio === 'Automatico') {
        cambioCounts[auto.cambio]++;
      }
    });
    const mostSoldCambio = cambioCounts['Manuale'] > cambioCounts['Automatico'] ? 'Manuale' : 'Automatico';
    if (formData.cambio === mostSoldCambio) {
      positiveParams++;
    } else {
      negativeParams++;
    }
    // **Neopatentati - Calcola il più usato tra true e false**
    const neopatentatiCounts: { [key: string]: number } = {'true': 0, 'false': 0};
    filteredAutos.forEach(auto => {
      if (auto.neopatentati) {
        neopatentatiCounts['true']++;
      } else {
        neopatentatiCounts['false']++;
      }
    });
    const mostSoldNeopatentati = neopatentatiCounts['true'] > neopatentatiCounts['false'] ? 'true' : 'false';
    if (formData.neopatentati.toString() === mostSoldNeopatentati) {
      positiveParams++;
    } else {
      negativeParams++;
    }
    // **Porte - Calcola il più usato tra 3 e 5 porte**
    const porteCounts: { [porte: number]: number } = { 3: 0, 5: 0 };

// Contiamo le porte tra tutte le auto non disponibili della categoria
    filteredAutos.forEach(auto => {
      if (auto.porte === 3 || auto.porte === 5) {
        porteCounts[auto.porte]++;
      }
    });

// Debug per verificare cosa stiamo contando
    console.log("Conteggio delle porte: ", porteCounts);

// Troviamo il valore con il maggior numero di occorrenze
    const mostSoldPorte = porteCounts[3] > porteCounts[5] ? 3 : 5;

// Debug per verificare il valore con il maggior numero di occorrenze
    console.log("Valore con il maggior numero di porte: ", mostSoldPorte);

// Converte formData.porte in numero (se è una stringa) prima del confronto
    const porteFormValue = Number(formData.porte); // Converte la stringa in numero

    console.log(`Confronto: porteFormValue = ${porteFormValue}, mostSoldPorte = ${mostSoldPorte}`);

// Confrontiamo il valore del form con il valore più comune
    if (porteFormValue === mostSoldPorte) {
      positiveParams++;
    } else {
      negativeParams++;
    }

    // **Carburante - Calcola il più usato e considera valori vicini al 10%**
    const carburanteCounts: { [carburante: string]: number } = {};
    filteredAutos.forEach(auto => {
      carburanteCounts[auto.carburante] = (carburanteCounts[auto.carburante] || 0) + 1;
    });

// Trova il massimo conteggio e considera anche valori vicini entro il 10%
    const maxCarburanteCount = Math.max(...Object.values(carburanteCounts));
    const carburanteCandidates = Object.keys(carburanteCounts).filter(
      carburante => carburanteCounts[carburante] >= maxCarburanteCount * 0.9
    );

// Verifica se il valore del form è tra i candidati
    if (carburanteCandidates.includes(formData.carburante)) {
      positiveParams++;
    } else {
      negativeParams++;
    }

    // **Chilometraggio - Calcola la media e verifica la tolleranza ±15%**
    const avgKilometers = filteredAutos.reduce((sum, auto) => sum + auto.chilometraggio, 0) / filteredAutos.length;
    const minKilometers = avgKilometers * 0.85;  // 15% in meno
    const maxKilometers = avgKilometers * 1.15;  // 15% in più
    if (formData.chilometraggio >= minKilometers && formData.chilometraggio <= maxKilometers) {
      positiveParams++;
    } else {
      negativeParams++;
    }
    // **Prezzo - Calcola la media e verifica la tolleranza ±15%**
    const avgPrice = filteredAutos.reduce((sum, auto) => sum + auto.prezzo, 0) / filteredAutos.length;
    const minPrice = avgPrice * 0.85;  // 15% in meno
    const maxPrice = avgPrice * 1.15;  // 15% in più
    if (formData.prezzo >= minPrice && formData.prezzo <= maxPrice) {
      positiveParams++;
    } else {
      negativeParams++;
    }
    // **Cilindrata - Calcola il valore più usato e considera valori vicini al 10%**
    const cilindrataCounts: { [cilindrata: number]: number } = {};
    filteredAutos.forEach(auto => (cilindrataCounts[auto.cilindrata] = (cilindrataCounts[auto.cilindrata] || 0) + 1));

// Trova il massimo conteggio e considera anche valori vicini entro il 10%
    const maxCilindrataCount = Math.max(...Object.values(cilindrataCounts));
    const cilindrataCandidates = Object.keys(cilindrataCounts)
      .map(key => +key)
      .filter(cilindrata => cilindrataCounts[cilindrata] >= maxCilindrataCount * 0.9);

// Verifica se il valore del form è tra i candidati
    if (cilindrataCandidates.includes(formData.cilindrata)) {
      positiveParams++;
    } else {
      negativeParams++;
    }

    // Calcola la probabilità di successo
    const totalParams = positiveParams + negativeParams;
    if (totalParams === 0) {
      alert('Impossibile calcolare la probabilità: nessun parametro valido.');
      return;
    }

    this.successProbability = (positiveParams / totalParams) * 100;

    this.service.addProbabilitaVendita(numeroValore, this.successProbability, id)
      .subscribe(response => {
      }, error => {
        console.error(`Errore nel salvataggio per l'auto ID: ${id}`);
      });

  }
}
