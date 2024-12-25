import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenti/home/home.component';
import { AuthenticationComponent } from './componenti/authentication/authentication.component';
import { Gestione_utentiComponent } from './componenti/gestione_utenti/gestione_utenti.component';
import { ProfiloComponent } from './componenti/profilo/profilo.component';
import { WishlistComponent } from './componenti/wishlist/wishlist.component';
import { AutoComponent } from './componenti/auto/auto.component';
import { Analisi_dei_datiComponent } from './componenti/analisi_dei_dati/analisi_dei_dati.component';
import { Gestione_autoComponent } from './componenti/aggiungi_auto/gestione_auto.component';
import { RicercaComponent } from './componenti/ricerca/ricerca.component'; // Importa il componente modale

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: AuthenticationComponent },
    ],
  },
  {
    path: 'parco_auto',
    component: HomeComponent,
    children: [
      { path: 'ricerca', component: RicercaComponent } // Modale o filtro avanzato
    ]
  },
  { path: 'gestione_utenti', component: Gestione_utentiComponent },
  { path: 'profilo', component: ProfiloComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'auto/:id', component: AutoComponent },
  { path: 'analisi_dei_dati', component: Analisi_dei_datiComponent },
  { path: 'gestione_auto', component: Gestione_autoComponent },
  { path: '**', redirectTo: 'home' }, // Fallback per percorsi sconosciuti
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
