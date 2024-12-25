package com.example.backend.Data.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wishlist")
@Data
@NoArgsConstructor
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)  // Lazily loaded per evitare caricare utente inutilmente
    @JoinColumn(name = "utente_email", referencedColumnName = "email", nullable = false)  // Collega la Wishlist all'utente tramite email
    private Utente utente;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER) // Relazione con Auto
    @JoinColumn(name = "auto_id", referencedColumnName = "id", nullable = false)
    private Auto auto;

    public Wishlist(Utente utente, Auto auto) {
        this.utente = utente;
        this.auto = auto;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    public Utente getUtente() {
        return utente;
    }
}
