package com.example.backend.Data.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="auto")
@Data
@NoArgsConstructor
public class Auto {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "categoria", nullable = false)
    private String categoria;

    @Column(name = "marca", nullable = false)
    private String marca;

    @Column(name = "modello", nullable = false)
    private String modello;

    @Column(name = "anno", nullable = false)
    private int anno;

    @Column(name = "carburante", nullable = false)
    private String carburante;

    @Column(name= "cambio", nullable = false)
    private String cambio;

    @Column(name = "chilometraggio", nullable = false)
    private int chilometraggio;

    @Column(name =  "prezzo", nullable = false)
    private  int prezzo;

    @Column(name = "cilindrata", nullable = false)
    private int cilindrata;

    @Column(name = "neopatentati", nullable = false)
    private boolean neopatentati;

    @Column(name = "porte", nullable = false)
    private int porte;

    @Column(name = "disponibile", nullable = false)
    private boolean disponibile;

    @Column(name= "descrizione", nullable = false) //targa, allestimento, classe emissioni, consumi, cilindri, peso, marce, posti, potenza, colore
    private String descrizione;

    @Column(name = "click_count", nullable = false)
    private int clickCount;

    @OneToMany(mappedBy = "auto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImmagineAuto> immagini;

    @OneToMany(mappedBy = "auto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Wishlist> wishlists;



}
