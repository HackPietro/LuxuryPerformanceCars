import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { Parco_auto } from './componenti/parco_auto/parco_auto';
import { FooterComponent } from './componenti/footer/footer.component';
import {Home} from "./componenti/home/home";
import { RicercaComponent } from './componenti/ricerca/ricerca.component';

// Material Design Modules (puoi aggiungere altri in base alle tue necessità)
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Gestione_utentiComponent} from "./componenti/gestione_utenti/gestione_utenti.component";
import {ProfiloComponent} from "./componenti/profilo/profilo.component";
import {WishlistComponent} from "./componenti/wishlist/wishlist.component";
import {AutoComponent} from "./componenti/auto/auto.component";
import {Analisi_dei_datiComponent} from "./componenti/analisi_dei_dati/analisi_dei_dati.component";
import {Gestione_autoComponent} from "./componenti/gestione_auto/gestione_auto.component";
import {
  Dati_successo_probabilita_venditaComponent
} from "./componenti/dati_successo_probabilita_vendita/dati_successo_probabilita_vendita.component";
@NgModule({
  declarations: [
    AppComponent,
    Parco_auto,
    FooterComponent,
    Home,
    RicercaComponent,
    Gestione_utentiComponent,
    ProfiloComponent,
    WishlistComponent,
    AutoComponent,
    Analisi_dei_datiComponent,
    Gestione_autoComponent,
    Dati_successo_probabilita_venditaComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    // Angular Material Modules
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatGridListModule,
    MatSelectModule,
    MatDialogModule,
    FontAwesomeModule,

  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent]
})
export class AppModule { }

