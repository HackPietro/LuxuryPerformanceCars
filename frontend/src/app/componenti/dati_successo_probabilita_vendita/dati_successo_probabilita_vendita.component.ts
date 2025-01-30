import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dati-successo-probabilita-vendita',
  templateUrl: './dati_successo_probabilita_vendita.component.html',
  styleUrls: ['./dati_successo_probabilita_vendita.component.css']
})
export class Dati_successo_probabilita_venditaComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
