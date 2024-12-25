import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ErrordialogComponent} from "../errordialog/errordialog.component";
import {SuccessdialogComponent} from "../successdialog/successdialog.component";
import {ServiceService} from "../../Service/service";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";


@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css'
})
export class ProfiloComponent implements OnInit{
  isEditing: boolean = false;
  showPassword: boolean = false;
  utente: any = localStorage.getItem("email");

  nomeValue: string = '';
  cognomeValue: string = '';
  emailValue: string = '';
  passwordValue: string = '';
  tipologiaValue: string = '';

  smallDevice: boolean = false;


  constructor(private service: ServiceService, public dialog: MatDialog, private breakpointObserver: BreakpointObserver) {
    // detect screen size changes
    this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.smallDevice = true;
      } else {
        this.smallDevice = false;
      }
    });
  }

  ngOnInit(): void {
    this.nomeValue = localStorage.getItem("nome") || "";
    this.cognomeValue = localStorage.getItem("cognome") || "";
    this.emailValue = localStorage.getItem("email") || "";
    this.passwordValue = localStorage.getItem("password") || "";
    this.tipologiaValue = localStorage.getItem("tipologia") || "";

    console.log("Valore di tipologia:", this.tipologiaValue);

  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  sendToServer(): void {

    this.service.updateUtente(this.emailValue, {
      nome: this.nomeValue,
      cognome: this.cognomeValue,
      email: this.emailValue,
      password: this.passwordValue,
      tipologia: this.tipologiaValue,
    }).subscribe({
      next: () => {
        localStorage.setItem("nome", this.nomeValue);
        localStorage.setItem("cognome", this.cognomeValue);
        localStorage.setItem("email", this.emailValue);
        localStorage.setItem("password", this.passwordValue);
        localStorage.setItem("tipologia", this.tipologiaValue);
      },
      error: () => this.dialog.open(ErrordialogComponent),
      complete: () => {
        this.dialog.open(SuccessdialogComponent);
        this.isEditing = !this.isEditing;
      }
    });
  }

}

