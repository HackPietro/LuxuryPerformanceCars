import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceService } from '../../Service/service';
import { Auto } from '../../Model/Auto';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  autoList: Auto[] = [];
  smallDevice: boolean = false;
  formFiltri: FormGroup = new FormGroup({});
  tipoSortValue: string = '';
  showRicercaAvanzata: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private service: ServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((result: BreakpointState) => {
        this.smallDevice = result.matches;
      });
  }

  ngOnInit(): void {
    // Recupera i criteri di ricerca da localStorage e se esistono, esegui la ricerca
    const savedSearch = localStorage.getItem('criteriRicerca');

    if (savedSearch) {
      const criteriPopolati = JSON.parse(savedSearch);

      // Esegui la ricerca con i criteri salvati
      const emailUtente = "nullo"; // o usa l'email utente se disponibile
      this.service.searchAutoByCriteria(criteriPopolati, emailUtente).subscribe(
        (result: Auto[]) => {
          this.autoList = result; // Mostra i risultati
        },
        (error) => {
          console.error("Errore nella ricerca delle auto", error);
        }
      );
    } else {
      // Se non ci sono criteri salvati, carica tutte le auto
      this.getAllAuto();
    }

    // Inizializza il form
    this.formFiltri = new FormGroup({
      sort: new FormControl(''),
      search: new FormControl('') // Campo di ricerca
    });

    this.tipoSortValue = '';
  }

  getAllAuto() {
    this.service.findAllAuto().subscribe({
      next: (auto) => {
        this.autoList = auto;
      },
      error: (err) => {
        console.error('Errore recuperando la lista delle auto:', err);
        this.autoList = []; // Assicurati che autoList sia vuoto in caso di errore
      }
    });
  }

  onAutoClick(autoId: number, event: Event): void {
    event.preventDefault();

    this.service.incrementClickCount(autoId).subscribe({
      next: () => {
        window.location.href = `http://localhost:4200/auto/${autoId}`;
      },
      error: (err) => {
        console.error('Errore incrementando il contatore:', err);
        window.location.href = `http://localhost:4200/auto/${autoId}`;
      }
    });
  }

  tipoSortValueChange(event: any) {
    this.tipoSortValue = event.target.value;
    this.sort();
  }

  sort() {
    if (this.tipoSortValue === 'crescente') {
      this.autoList.sort((a, b) => a.prezzo - b.prezzo);
    } else if (this.tipoSortValue === 'decrescente') {
      this.autoList.sort((a, b) => b.prezzo - a.prezzo);
    } else if (this.tipoSortValue === 'A-Z') {
      this.autoList.sort((a, b) => a.marca.localeCompare(b.marca));
    } else if (this.tipoSortValue === 'Z-A') {
      this.autoList.sort((a, b) => b.marca.localeCompare(a.marca));
    }
  }

  toggleRicercaAvanzata() {
    this.showRicercaAvanzata = !this.showRicercaAvanzata;
  }

  aggiornaAutoList(risultatiRicerca: Auto[]) {
    this.autoList = risultatiRicerca;
  }
}
