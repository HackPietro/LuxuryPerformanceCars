import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Auto } from '../Model/Auto';
import { Wishlist } from '../Model/Wishlist';
import { catchError } from 'rxjs/operators';
import { Utente } from "../Model/Utente";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private baseUrl = 'http://localhost:8080/api'; // Base URL per tutte le API

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }

    console.error(errorMessage); // Log dell'errore
    return throwError(() => new Error(errorMessage)); // Ritorna un errore
  }

  // ---------------------- Auto API ----------------------

  searchAutoByCriteria(criteri: { nome: string; valore: any }[], email: string): Observable<Auto[]> {
    let params = new HttpParams();

    criteri.forEach(criterio => {
      params = params.append(criterio.nome, criterio.valore);  // Aggiunge i criteri alla query
    });

    // L'email viene passata solo per registrare la ricerca, non per filtrare le auto
    params = params.append('email', email);

    return this.http.get<Auto[]>(`${this.baseUrl}/auto/search`, { params })
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  saveOrUpdateAuto(auto: Auto): Observable<Auto> {
    return this.http.post<Auto>(`${this.baseUrl}/auto`, auto)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  findAllAuto(): Observable<Auto[]> {
    return this.http.get<Auto[]>(`${this.baseUrl}/auto/findAll`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  findAllAutoDisponibili(): Observable<Auto[]> {
    return this.http.get<Auto[]>(`${this.baseUrl}/auto/findAllDisponibili`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getAutoById(id: number): Observable<Auto> {
    return this.http.get<Auto>(`${this.baseUrl}/auto/get/${id}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  incrementClickCount(autoId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auto/${autoId}/increment-click`, null)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getCategoryAuto(category: string): Observable<Auto[]>{
    return this.http.get<Auto[]>(`${this.baseUrl}/auto/findCategoryAuto/${category}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  deleteAutoById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/auto/${id}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }
  getMarche(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/auto/marche`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getModelliByMarca(marca: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/auto/modelli?marca=${marca}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  // ---------------------- Utente API ----------------------

  saveUtente(utente: Utente): Observable<Utente> {
    return this.http.post<Utente>(`${this.baseUrl}/utenti`, utente)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  findAllUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.baseUrl}/utenti/findAll`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getUtenteById(id: number): Observable<Utente> {
    return this.http.get<Utente>(`${this.baseUrl}/utenti/get/${id}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getUtenteByEmail(email: string): Observable<Utente> {
    return this.http.get<Utente>(`${this.baseUrl}/utenti/getByEmail/${email}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  updateUtente(email: string, utenteDto: Utente): Observable<Utente> {
    return this.http.put<Utente>(`${this.baseUrl}/utenti/update/${email}`, utenteDto)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  deleteUtenteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/utenti/${id}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  deleteUtenteByEmail(email: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/utenti/deleteByEmail/${email}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getUserDetails(sessionId: string | null | undefined) {
    return this.http.get<Utente>(`${this.baseUrl}/utenti/user-details?sessionId=${sessionId}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  setUserType(email: string, tipologia: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/utenti/setUserType?email=${email}&tipologia=${tipologia}`, {})
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  // ---------------------- Wishlist API ----------------------

  addToWishlist(email: string, autoId: number): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${this.baseUrl}/wishlist/add?email=${email}&autoId=${autoId}`, {})
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  removeAllForWishlist(email: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/wishlist/removeAll?email=${email}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  removeItemForWishlist(email: string, autoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/wishlist/removeItem?email=${email}&autoId=${autoId}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getWishlistAuto(email: string): Observable<Auto[]> {
    return this.http.get<Auto[]>(`${this.baseUrl}/wishlist/auto?email=${email}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  findImageByAutoID(id: number): Observable<{ img: string }> {
    return this.http.get<{ img: string }>(`${this.baseUrl}/auto/getImage/${id}`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  // ---------------------- Analisi dei dati ----------------------

  getMarcheFromSavedSearches(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/ricerche/marche`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getPrezziMinFromSavedSearches(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/ricerche/prezziMin`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getPrezziMaxFromSavedSearches(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/ricerche/prezziMax`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getPorteFromSavedSearches(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/ricerche/porte`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getNeopatentatiFromSavedSearches(): Observable<boolean[]> {
    return this.http.get<boolean[]>(`${this.baseUrl}/ricerche/neopatentati`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getKmMinFromSavedSearches(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/ricerche/kmMin`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getKmMaxFromSavedSearches(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/ricerche/kmMax`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getAnnoMinFromSavedSearches(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/ricerche/annoMin`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getAnnoMaxFromSavedSearches(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/ricerche/annoMax`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getCambioFromSavedSearches(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/ricerche/cambio`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getCarburanteFromSavedSearches(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/ricerche/carburante`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getCategoriaFromSavedSearches(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/ricerche/categoria`)
      .pipe(
        catchError(this.handleError) // Gestione errore
      );
  }

  getModelliDiUnaMarcaFromSavedSearches(marca: string): Observable<string[]> {
    const params = new HttpParams().set('marca', marca);
    return this.http.get<string[]>(`${this.baseUrl}/ricerche/modelliDiUnaMarca`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  addAuto(auto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auto/add`, auto);
  }

  addImmagineAuto(immagine: { autoId: number, immagineBase64: string }): Observable<any> {
    // Crea un oggetto che include l'ID dell'auto e l'immagine in base64
    const body = {
      immagineBase64: immagine.immagineBase64,  // La stringa Base64 dell'immagine
    };
    return this.http.post(`${this.baseUrl}/auto/${immagine.autoId}/aggiungi-immagine`, body);
  }

  updateDisponibilitaAuto(autoId: number, disponibile: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/auto/${autoId}/update-disponibilita`, disponibile);
  }

  deleteImmagineAuto(autoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/auto/${autoId}/elimina-immagine`);
  }

  findByMarcaAndModello(marca: string, modello: string): Observable<Map<number, number>[]> {
    const params = new HttpParams()
      .set('marca', marca)
      .set('modello', modello);

    return this.http.get<Map<number, number>[]>(`${this.baseUrl}/auto/findByMarcaAndModello`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  findIdsByBrandAndModel(marca: string, modello: string): Observable<number[]> {
    const params = new HttpParams()
      .set('marca', marca)
      .set('modello', modello);

    return this.http.get<number[]>(`${this.baseUrl}/auto/findIdsByBrandAndModel`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getSuccessoVenditaById(id: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/probabilita-vendita/getSuccessoVenditaById/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMaxNumeroValore(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/probabilita-vendita/getMaxNumeroValore`)
      .pipe(
        catchError(this.handleError)
      )
  }

  addProbabilitaVendita(numeroValore: number, percentuale: number, autoId: number): Observable<string> {
    const params = new HttpParams()
      .set('numeroValore', numeroValore.toString())
      .set('percentuale', percentuale.toString())
      .set('autoId', autoId.toString());
    return this.http.post<string>(`${this.baseUrl}/probabilita-vendita/addProbabilitaVendita`, null, {params})
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllIdAutoDisponibili(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/auto/allIdDisponibili`)
      .pipe(
        catchError(error => {
          console.error('Errore durante il recupero degli ID delle auto disponibili:', error);
          return throwError(error); // Propaga l'errore
        }) // Gestione degli errori
      );
  }



}
