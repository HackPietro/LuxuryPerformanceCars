package com.example.backend.Data.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="utente")
@Data
@NoArgsConstructor
public class Utente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name="nome")
    private String nome;

    @Column(name="cognome")
    private String cognome;

    @Column(name = "tipologia")
    private String tipologia;

    @JsonManagedReference
    @OneToMany(mappedBy = "utente", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Wishlist> wishlist;


    public Utente(String email, String password, String nome, String cognome, String tipologia) {
        this.email = email;
        this.password = password;
        this.nome = nome;
        this.cognome = cognome;
        this.tipologia = tipologia;
    }

    public Utente(Long id) {
        this.id = id;
    }
}
