import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ServiceService } from '../../Service/service';
import { MatDialog } from '@angular/material/dialog';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-aggiungi_auto',
  templateUrl: './gestione_auto.component.html',
  styleUrls: ['./gestione_auto.component.css']
})
export class Gestione_autoComponent implements OnInit {
  public formAggiungiAuto: FormGroup = new FormGroup({});
  public images: string[] = [];
  public autoExists: boolean = false;
  public selectedAutoId: number = 0;
  public successProbability: number = 0;

  private autoList: any[] = [];


  constructor(
    private service: ServiceService,
    public dialog: MatDialog,
    private compressImage: NgxImageCompressService
  ) {}

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
      this.service.deleteAuto(autoId).subscribe({
        next: (response) => {
          console.log('Auto eliminata con successo', response);
          this.service.deleteImmagineAuto(autoId).subscribe({
            next: () => {
              console.log('Immagini associate all\'auto eliminate con successo.');
              alert('Immagini associate all\'auto eliminate con successo.');
            },
            error: (error) => {
              console.error('Errore durante l\'eliminazione delle immagini', error);
              alert('Errore nell\'eliminazione delle immagini');
            }
          });
        },
        error: (error) => {
          console.error('Errore durante l\'eliminazione dell\'auto', error);
          alert('Errore nell\'eliminazione dell\'auto');
        }
      });
    } else {
      alert('ID auto non valido!');
    }
  }

  // Funzione per aggiungere l'auto
  addAuto(): void {
    const auto = { ...this.formAggiungiAuto.value };

    this.service.addAuto(auto).subscribe((response) => {
      // Se ci sono immagini, le aggiungiamo una alla volta
      if (this.images.length > 0) {
        this.images.forEach(image => {
          const immagine = { autoId: response.id, immagineBase64: image };
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

    // Usa tutte le auto (sia vendute che disponibili)
    const allAutos = this.autoList;

    // Mostra un alert con tutte le auto
    const autoDetails = allAutos
      .map(auto =>
        `ID: ${auto.id}, Marca: ${auto.marca}, Modello: ${auto.modello}, Anno: ${auto.anno}, Prezzo: ${auto.prezzo}, Chilometraggio: ${auto.chilometraggio}, Disponibile: ${auto.disponibile}`
      )
      .join('\n');
    alert(`Tutte le auto considerate:\n\n${autoDetails}`);

    // Calcola la distanza tra i dati dell'auto inserita e le auto esistenti
    const distances = allAutos.map(auto => ({
      auto,
      distance: Math.sqrt(
        Math.pow(auto.anno - formData.anno, 2) +
        Math.pow(auto.chilometraggio - formData.chilometraggio, 2) +
        Math.pow(auto.prezzo - formData.prezzo, 2) +
        Math.pow(auto.cilindrata - formData.cilindrata, 2)
      )
    }));

    distances.sort((a, b) => a.distance - b.distance);

    // Prendi i k vicini più vicini
    const k = 5; // Cambia k secondo necessità
    const nearestNeighbors = distances.slice(0, k);

    // Calcola la proporzione di auto vendute nei vicini
    const soldCount = nearestNeighbors.filter(({ auto }) => !auto.disponibile).length;
    this.successProbability = (soldCount / k) * 100;

    // Mostra la percentuale di successo
    alert(`Probabilità di vendita: ${this.successProbability.toFixed(2)}%`);
  }
  onCheckProbability(): void {
    this.calculateSuccessProbability();
  }
}
