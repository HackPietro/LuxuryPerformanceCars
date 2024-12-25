package com.example.backend.Contoller;

import com.example.backend.Data.Entities.Utente;
import com.example.backend.Dto.UtenteDto; // Importa il DTO UtenteDto
import com.example.backend.Data.Service.UtenteService; // Importa il servizio UtenteService
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200") // Consente le richieste dal frontend in Angular
@RequestMapping("/api/utenti") // Path principale per tutti i metodi
@RequiredArgsConstructor // Crea automaticamente un'istanza di UtenteService
public class UtenteController {

    private final UtenteService utenteService; // Iniezione del servizio UtenteService
    private final HttpServletRequest request;


    @PostMapping("") // Aggiungi un nuovo utente
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UtenteDto> saveUtente(@RequestBody UtenteDto utenteDto) {
        UtenteDto savedUtente = utenteService.saveUtente(utenteDto); // Salva l'utente
        return ResponseEntity.ok(savedUtente); // Restituisce l'utente salvato
    }

    @GetMapping("/findAll") // Trova tutti gli utenti
    public ResponseEntity<List<UtenteDto>> findAll() {
        List<UtenteDto> utentiList = utenteService.findAll(); // Ottiene la lista degli utenti
        return ResponseEntity.ok(utentiList); // Restituisce la lista degli utenti
    }

    @GetMapping("/get/{id}") // Ottieni un utente per ID
    public ResponseEntity<UtenteDto> getById(@PathVariable Long id) {
        UtenteDto utente = utenteService.getById(id); // Ottiene l'utente specificato dall'ID
        return utente != null ? ResponseEntity.ok(utente) : ResponseEntity.notFound().build(); // Restituisce l'utente trovato o 404
    }

    @GetMapping("/getByEmail/{email}")
    public ResponseEntity<UtenteDto> getByEmail(@PathVariable String email) {
        UtenteDto utente = utenteService.getByEmail(email);
        if (utente != null) {
            return ResponseEntity.ok(utente);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/update/{email}") // Aggiorna un utente tramite email
    public ResponseEntity<UtenteDto> updateUtente(@PathVariable String email, @RequestBody UtenteDto utenteDto) {
        UtenteDto updatedUtente = utenteService.updateUtenteByEmail(email, utenteDto); // Usa l'email invece dell'ID
        return ResponseEntity.ok(updatedUtente); // Restituisce l'utente aggiornato
    }

    @DeleteMapping("/{id}") // Elimina un utente per ID
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        utenteService.deleteById(id); // Elimina l'utente specificato
        return ResponseEntity.noContent().build(); // Restituisce una risposta senza contenuto
    }

    @DeleteMapping("/deleteByEmail/{email}") // Endpoint per eliminare tramite email
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteByEmail(@PathVariable String email) {
        utenteService.deleteByEmail(email); // Chiama il servizio per eliminare l'utente
        return ResponseEntity.noContent().build(); // Restituisce una risposta senza contenuto
    }

    @GetMapping("/user-details")
    public ResponseEntity<Utente> getUserDetails(@RequestParam String sessionId) {
        HttpSession session = (HttpSession) request.getServletContext().getAttribute(sessionId);
        if(session != null) {
            Utente utente = (Utente) session.getAttribute("utente");
            return ResponseEntity.ok(utente);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/setUserType") // Imposta la tipologia per un utente specificato dall'email
    public ResponseEntity<Void> setUserType(@RequestParam String email, @RequestParam String tipologia) { // Cambiato da boolean a String
        utenteService.setUserType(email, tipologia); // Chiama il servizio per impostare la tipologia utente
        return ResponseEntity.noContent().build();
    }

}
