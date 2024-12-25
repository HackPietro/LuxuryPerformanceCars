import {ImmagineAuto} from "./ImmagineAuto";

export class Auto {
  id!: number;
  categoria!: string;
  marca!: string;
  modello!: string;
  anno!: number;
  carburante!: string;
  cambio!: string;
  chilometraggio!: number;
  prezzo!: number;
  cilindrata!: number;
  neopatentati!: boolean;
  porte!: number;
  disponibile!: boolean;
  descrizione!: string;

  immagini!: ImmagineAuto[]; // Array di oggetti ImmagineAuto
  currentImageIndex: number = 0; // Indice dell'immagine corrente


}
