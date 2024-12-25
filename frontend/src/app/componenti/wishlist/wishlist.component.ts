import { Component, OnInit } from '@angular/core';
import { Auto } from "../../Model/Auto";
import { ServiceService } from "../../Service/service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  utente: string | null = localStorage.getItem("email");
  wishlistAuto: any[] = []; // Modifica in base al tipo di dato effettivo della wishlist (potrebbe essere un array di oggetti)
  wishlistAutoWithDetails: any[] = [];
  autoDetails: Auto[] = []; // Dettagli delle auto
  images: { [key: string]: string } = {};  // Gestione immagini

  constructor(private service: ServiceService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadWishlistData();
  }

  loadWishlistData() {
    if (this.utente) {
      this.service.getWishlistAuto(this.utente).subscribe({
        next: (wishlistAuto) => {
          // Ora salviamo nell'array wishlistAutoWithDetails
          this.wishlistAuto = wishlistAuto;  // Manteniamo anche la versione base per interazione con il server

          const autoIds = this.wishlistAuto.map(item => item.autoId);

          if (autoIds.length > 0) {
            autoIds.forEach((autoId, index) => {
              this.service.getAutoById(autoId).subscribe({
                next: (autoDetails: Auto) => {
                  // Aggiungiamo l'auto con il suo ID della wishlist
                  const wishlistItem = {
                    autoId: autoDetails.id,
                    details: autoDetails,
                    wishlistId: this.wishlistAuto[index].id // Assumendo che ogni item di wishlistAuto ha un campo 'id'
                  };
                  this.wishlistAutoWithDetails.push(wishlistItem);  // Aggiungiamo l'auto con dettagli

                  // Caricamento dell'immagine
                  this.service.findImageByAutoID(autoId).subscribe({
                    next: (img) => {
                      if (img) {
                        this.images[autoId] = img.img;
                      }
                    },
                    error: (err) => console.error("Errore nel caricamento dell'immagine:", err)
                  });
                },
                error: (err) => console.error("Errore nel recupero dei dettagli dell'auto:", err)
              });
            });
          }
        },
        error: (error) => console.error("Errore nel caricamento della wishlist:", error)
      });
    }
  }


  removeItem(auto: any) {
    if (this.utente) {
      // Troviamo l'elemento nella wishlistAutoWithDetails usando l'autoId
      const indexInWishlistWithDetails = this.wishlistAutoWithDetails.findIndex(item => item.autoId === auto.autoId);

      if (indexInWishlistWithDetails > -1) {
        // Rimuoviamo l'elemento dalla wishlistAutoWithDetails
        this.wishlistAutoWithDetails.splice(indexInWishlistWithDetails, 1);

        // Chiamata al servizio per rimuovere l'auto dal server
        this.service.removeItemForWishlist(this.utente, auto.autoId).subscribe({
          next: () => {
            console.log("Auto rimossa dalla wishlist con successo");
          },
          error: (error) => console.error("Errore nella rimozione dell'auto:", error)
        });
      }
    }
  }




  removeAll() {
    if (this.utente) {
      // Rimuovi tutte le auto dalle liste locali (ora lavoriamo solo con wishlistAutoWithDetails)
      this.wishlistAutoWithDetails = [];  // Resetta la lista dei dettagli delle auto

      // Chiamata al servizio per rimuovere tutte le auto dal server
      this.service.removeAllForWishlist(this.utente).subscribe({
        next: () => {
          console.log("Tutte le auto sono state rimosse dalla wishlist con successo.");
        },
        error: (error) => console.error("Errore nella rimozione di tutte le auto:", error)
      });
    }
  }


}
