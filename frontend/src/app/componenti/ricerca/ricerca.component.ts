import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { AuthService } from "../../auth/auth.service";
import { ServiceService } from "../../Service/service";
import { Auto } from '../../Model/Auto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.css'],
})
export class RicercaComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() searchResults = new EventEmitter<Auto[]>(); // Nuovo output per emettere i risultati

  form: FormGroup = new FormGroup({
    criteri: new FormArray([]),
  });

  criteriDisponibili: { nome: string; placeholder: string; type?: string }[] = [
    {nome: 'categoria', placeholder: 'Categoria'},
    {nome: 'marca', placeholder: 'Marca'},
    {nome: 'modello', placeholder: 'Modello'},
    {nome: 'carburante', placeholder: 'Carburante'},
    {nome: 'annoDa', placeholder: 'Anno da', type: 'number'},
    {nome: 'annoA', placeholder: 'Anno a', type: 'number'},
    {nome: 'neopatentati', placeholder: 'Adatta a neopatentati'},
    {nome: 'chilometraggioDa', placeholder: 'Chilometraggio da'},
    {nome: 'chilometraggioA', placeholder: 'Chilometraggio a'},
    {nome: 'cambio', placeholder: 'Tipo di cambio'},
    {nome: 'porte', placeholder: 'Numero di porte'},
    {nome: 'prezzoMin', placeholder: 'Prezzo min', type: 'number'},
    {nome: 'prezzoMax', placeholder: 'Prezzo max', type: 'number'},
  ];

  marche: string[] = []; // Liste dinamiche
  modelli: string[] = [];
  criteriSelezionati: Set<string> = new Set();

  constructor(
    private service: ServiceService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.caricaMarche(); // Carica le marche all'inizio
  }

  ngOnInit() {
    const savedCriteria = localStorage.getItem('criteriRicerca');
    if (savedCriteria) {
      const criteriPopolati = JSON.parse(savedCriteria);

      // Ripristina i criteri nel modulo
      criteriPopolati.forEach((criterio: any) => {
        const criterioDisponibile = this.criteriDisponibili.find(c => c.nome === criterio.nome);
        if (criterioDisponibile) {
          this.aggiungiCriterio(criterioDisponibile);
          const lastIndex = this.criteri.length - 1;
          this.criteri.at(lastIndex).patchValue(criterio); // Precompila i campi con i valori salvati
        }
      });
    }
  }

  get criteri() {
    return this.form.get('criteri') as FormArray;
  }

  caricaMarche() {
    this.service.getMarche().subscribe(
      (marche: string[]) => {
        this.marche = marche;
      },
      (error) => {
        this.snackBar.open("Errore nel caricamento delle marche", "Chiudi", {duration: 3000});
      }
    );
  }

  caricaModelli(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const marcaSelezionata = selectElement.value;
    if (marcaSelezionata) {
      this.service.getModelliByMarca(marcaSelezionata).subscribe(
        (modelli: string[]) => {
          this.modelli = modelli;
        },
        (error) => {
          this.snackBar.open("Errore nel caricamento dei modelli", "Chiudi", {duration: 3000});
        }
      );
    }
  }

  onCriterioChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCriterioNome = selectElement.value;

    if (selectedCriterioNome && !this.criteriSelezionati.has(selectedCriterioNome)) {
      const criterio = this.criteriDisponibili.find(c => c.nome === selectedCriterioNome);
      this.aggiungiCriterio(criterio);
      selectElement.value = ''; // Reset
    }
  }

  aggiungiCriterio(criterio?: { nome: string; placeholder: string; type?: string }) {
    if (!criterio) return;

    this.criteri.push(
      new FormGroup({
        nome: new FormControl(criterio.nome),
        valore: new FormControl(''),
        type: new FormControl(criterio.type || 'text'),
        placeholder: new FormControl(criterio.placeholder),
      })
    );

    this.criteriSelezionati.add(criterio.nome);
  }

  rimuoviCriterio(indice: number) {
    const criterioNome = this.criteri.at(indice).get('nome')?.value;
    this.criteriSelezionati.delete(criterioNome);
    this.criteri.removeAt(indice);
  }

  submit() {
    const criteriPopolati = this.criteri.controls
      .map(group => group.value)
      .filter(criterio => criterio.valore);

    const emailUtente = this.authService.utenteCorrente?.email;

    // Salviamo i criteri di ricerca nel localStorage
    localStorage.setItem('criteriRicerca', JSON.stringify(criteriPopolati));

    if (emailUtente) {
      this.service.searchAutoByCriteria(criteriPopolati, emailUtente).subscribe(
        (result: Auto[]) => {
          this.searchResults.emit(result);  // Emetti i risultati della ricerca
          this.close.emit();  // Chiudi il componente dopo la ricerca
        },
        (error) => {
          this.snackBar.open("Errore nella ricerca delle auto", "Chiudi", {duration: 3000});
          this.close.emit();  // Chiudi il componente anche in caso di errore
        }
      );
    } else {
      const emailUtente = "nullo";
      this.service.searchAutoByCriteria(criteriPopolati, emailUtente).subscribe(
        (result: Auto[]) => {
          this.searchResults.emit(result);  // Emetti i risultati della ricerca
          this.close.emit();  // Chiudi il componente dopo la ricerca
        },
        (error) => {
          this.snackBar.open("Errore nella ricerca delle auto", "Chiudi", {duration: 3000});
          this.close.emit();  // Chiudi il componente anche in caso di errore
        }
      );
    }
  }
}
