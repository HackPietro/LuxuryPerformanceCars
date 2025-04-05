import { Component, OnInit } from '@angular/core';
import { faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from "@angular/router";
import { ServiceService } from "../../Service/service";
import { Auto } from "../../Model/Auto";
import { AuthService } from "../../auth/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ImmagineAuto } from "../../Model/ImmagineAuto";
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-auto',
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.css']
})
export class AutoComponent implements OnInit {

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;


  smallDevice: boolean = false;
  autoId: number = 0;
  categoria: string = "";
  marca: string = "";
  modello: string = "";
  anno: number = 0;
  carburante: string = "";
  cambio: string = "";
  chilometraggio: number = 0;
  prezzo: number = 0;
  cilindrata: number = 0;
  neopatentati: boolean = false;
  porte: number = 0;
  descrizione: string = "";

  imagesSingleAuto: ImmagineAuto[] = [];
  currentImageIndex: number = 0;

  autoCorrelate: Auto[] = [];
  relatedAutoimages: { [key: number]: string } = {};

  menuOpen = false;
  faFacebook = faFacebook;
  faWhatsapp = faWhatsapp;
  faEnvelope = faEnvelope;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private service: ServiceService,
    public auth: AuthService,
    public dialog: MatDialog
  ) {
    this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe((result: BreakpointState) => {
      this.smallDevice = result.matches;
    });
  }

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe((loggedIn) => {
      console.log("User isLoggedIn status:", loggedIn); // Stampa lo stato di isLoggedIn
      this.isLoggedIn = loggedIn;
    });

    this.auth.userRole$.subscribe((role) => {
      this.isAdmin = role === 'admin';
    });

    this.route.params.subscribe(params => {
      this.autoId = +params['id'];
      this.getAutoInfo();
    });
  }

  getAutoInfo() {
    this.service.getAutoById(this.autoId).subscribe({
      next: (auto) => {
        this.categoria = auto.categoria;
        this.marca = auto.marca;
        this.modello = auto.modello;
        this.anno = auto.anno;
        this.carburante = auto.carburante;
        this.cambio = auto.cambio;
        this.chilometraggio = auto.chilometraggio;
        this.prezzo = auto.prezzo;
        this.cilindrata = auto.cilindrata;
        this.neopatentati = auto.neopatentati;
        this.porte = auto.porte;
        this.descrizione = auto.descrizione;

        this.imagesSingleAuto = auto.immagini || [];
        this.currentImageIndex = 0;

        this.getRelatedAuto();
      },
      error: (err) => {
        console.error("Errore nel caricamento dell'auto:", err);
      }
    });
  }

  getRelatedAuto() {
    this.service.getCategoryAuto(this.categoria).subscribe({
      next: (auto) => {
        // Filtra l'auto corrente dalla lista delle auto correlate
        auto = auto.filter(auto => auto.id !== this.autoId && auto.disponibile);
        this.autoCorrelate = auto;

        this.autoCorrelate.forEach((auto) => {
          this.service.findImageByAutoID(auto.id).subscribe({
            next: (response) => {
              if (response && response.img) {
                // Assegna l'immagine correlata all'auto
                this.relatedAutoimages[auto.id] = response.img;
              } else {
                // Se non c'è immagine, assegna un'immagine di fallback
                this.relatedAutoimages[auto.id] = 'assets/no_images_found.png';
              }
            },
            error: (err) => {
              console.error(`Errore nel caricamento dell'immagine per l'auto con id ${auto.id}:`, err);
              this.relatedAutoimages[auto.id] = 'assets/no_images_found.png'; // Immagine di fallback
            }
          });
        });
      },
      error: (err) => {
        console.error("Errore nel caricamento delle auto correlate:", err);
      }
    });
  }


  nextImage() {
    if (this.imagesSingleAuto.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imagesSingleAuto.length;
    }
  }

  prevImage() {
    if (this.imagesSingleAuto.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.imagesSingleAuto.length) % this.imagesSingleAuto.length;
    }
  }

  shareAction() {
    this.menuOpen = !this.menuOpen;
  }

  shareTo(social: string): void {
    const shareUrl = `localhost:4200/prodotto/${this.autoId}`;
    const shareText = `Guarda questo prodotto: ${this.marca} "${this.modello}" \nDescrizione: ${this.descrizione}\nPrezzo: ${this.prezzo}€`;

    switch (social) {
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`;
        window.open(facebookUrl, '_blank');
        break;
      case 'whatsapp':
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
        window.open(whatsappUrl, '_blank');
        break;
      case 'mail':
        const subject = encodeURIComponent(`Check out this product: ${this.marca} "${this.modello}"`);
        const body = encodeURIComponent(`${this.descrizione}\nPrezzo: ${this.prezzo}€\n\n${shareUrl}`);
        const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
        break;
      default:
        break;
    }
  }

  addToWishlist() {
    let utente = localStorage.getItem("email");
    if (utente == null) {
      utente = "null";
    }

    // Recupera la wishlist dell'utente
    this.service.getWishlistAuto(utente).subscribe({
      next: (wishlistAutos: any[]) => {
        // Creiamo un array con gli autoId della wishlist
        const autoIds = wishlistAutos.map(item => item.autoId);

        // Verifica se l'autoId è già nella lista
        if (autoIds.includes(this.autoId)) {
          alert("Questa auto è già nella tua wishlist.");
        } else {
          // Aggiungi l'auto alla wishlist se non presente
          // @ts-ignore
          this.service.addToWishlist(utente, this.autoId).subscribe({
            next: () => {
              alert("Auto aggiunta con successo alla wishlist!");
              window.location.reload();
            },
            error: (error) => {
              console.error("Errore durante l'aggiunta alla wishlist:", error);
            }
          });
        }
      },
      error: (error) => {
        console.error("Errore durante il recupero della wishlist:", error);
      }
    });
  }

}
