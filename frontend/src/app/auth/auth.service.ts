import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceService } from "../Service/service";
import { ActivatedRoute } from "@angular/router";
import { Utente } from "../Model/Utente";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();

  sessionId: string | null | undefined;
  utenteCorrente: Utente | null = null;

  constructor(private service: ServiceService, private route: ActivatedRoute) {
    this.loadAuthState();
  }

  private loadAuthState() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === 'true';
    const role = localStorage.getItem("tipologia");

    if (isLoggedIn && role) {
      this.isLoggedInSubject.next(true);
      this.userRoleSubject.next(role);
    } else {
      this.checkLogin();
    }
  }

  checkLogin(): void {
    this.sessionId = this.route.snapshot.queryParams['sessionId'];
    if (!this.sessionId) {
      this.setLoggedIn(false);
      return;
    }

    this.service.getUserDetails(this.sessionId).subscribe({
      next: (data) => {
        this.utenteCorrente = data;
        if (this.isUserComplete(this.utenteCorrente)) {
          const userRole = this.utenteCorrente.tipologia === "admin" ? "admin" : "utente";
          this.setLoggedIn(true, userRole);

          localStorage.setItem("nome", this.utenteCorrente.nome);
          localStorage.setItem("cognome", this.utenteCorrente.cognome);
          localStorage.setItem("email", this.utenteCorrente.email);
          localStorage.setItem("password", this.utenteCorrente.password);
        } else {
          this.setLoggedIn(false);
        }
      },
      error: () => {
        this.loadUserFromLocalStorage();
      },
    });
  }

  private setLoggedIn(isLoggedIn: boolean, role: string | null = null): void {
    this.isLoggedInSubject.next(isLoggedIn);
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());

    if (role) {
      this.userRoleSubject.next(role);
      localStorage.setItem("tipologia", role);
    } else {
      localStorage.removeItem("tipologia");
      this.userRoleSubject.next(null);
    }
  }

  private isUserComplete(utente: Utente): boolean {
    return utente.nome !== null && utente.cognome !== null && utente.email !== null && utente.password !== null;
  }

  private loadUserFromLocalStorage() {
    const userFromLS = localStorage.getItem("email");
    if (userFromLS && localStorage.getItem("nome") && localStorage.getItem("email")) {
      this.utenteCorrente = new Utente();
      this.utenteCorrente.nome = localStorage.getItem("nome") || '';
      this.utenteCorrente.cognome = localStorage.getItem("cognome") || '';
      this.utenteCorrente.email = localStorage.getItem("email") || '';
      this.utenteCorrente.password = localStorage.getItem("password") || '';


      const storedRole = localStorage.getItem("tipologia");
      this.setLoggedIn(true, storedRole);
    } else {
      this.setLoggedIn(false);
    }
  }

  isAdmin(): boolean {
    return this.userRoleSubject.getValue() === "admin";
  }

  logout(): void {
    this.setLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("tipologia");
    localStorage.removeItem("nome");
    localStorage.removeItem("cognome");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    this.utenteCorrente = null;
  }
}
