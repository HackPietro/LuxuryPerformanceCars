import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {ServiceService} from "../../Service/service";
import {MatDialog} from "@angular/material/dialog";
import {ErrordialogComponent} from "../errordialog/errordialog.component";
import {SuccessdialogComponent} from "../successdialog/successdialog.component";
@Component({
  selector: 'app-gestione_utenti',
  templateUrl: './gestione_utenti.component.html',
  styleUrls: ['./gestione_utenti.component.css']
})
export class Gestione_utentiComponent implements OnInit{
  public RimuoviUserForm: FormGroup = new FormGroup({});
  public TypeUserForm: FormGroup = new FormGroup({});

  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;


  constructor(private service: ServiceService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.RimuoviUserForm = new FormGroup({
      email: new FormControl()
    })
    this.TypeUserForm =  new FormGroup({
      email: new FormControl(),
      isAdmin: new FormControl()
    })
  }

  onRemoveUserFormSubmit(){
    let email = this.RimuoviUserForm.value.email;
    if (email == null || email == "null"){
      return;
    }
    this.service.getUtenteByEmail(email).subscribe({
      next: (utente) => {
        if (utente != null){
          this.showSuccessMessage = true;
          this.showErrorMessage = false;
          this.service.deleteUtenteByEmail(email).subscribe();
          this.RimuoviUserForm.reset();
        }
      },
      error:() =>{
        this.showSuccessMessage = false;
        this.showErrorMessage = true;
      }
    })
  }

  setUserType() {
    let email = this.TypeUserForm.value.email;  // Cambiato da cf a email
    let tipologia = this.TypeUserForm.value.tipologia;  // Cambiato da tipologia a isAdmin

    if (email && (tipologia == "admin" || tipologia == "utente")) {  // Validazione di email e tipo isAdmin
      this.service.setUserType(email, tipologia).subscribe({
        next: () => {
          this.dialog.open(SuccessdialogComponent);
          this.TypeUserForm.reset();
        },
        error: () => {
          this.dialog.open(ErrordialogComponent);
        }
      });
    } else {
      this.dialog.open(ErrordialogComponent);  // Mostra il dialogo di errore se gli input sono non validi
    }
  }


}
