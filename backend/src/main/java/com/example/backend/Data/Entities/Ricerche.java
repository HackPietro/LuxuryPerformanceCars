package com.example.backend.Data.Entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ricerche")
@Data
@NoArgsConstructor
public class Ricerche {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utente_email", referencedColumnName = "email", nullable = true)
    private Utente utente;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "marca")
    private String marca;

    @Column(name = "modello")
    private String modello;

    @Column(name = "carburante")
    private String carburante;

    @Column(name = "anno_da")
    private Integer annoDa;

    @Column(name = "anno_a")
    private Integer annoA;

    @Column(name = "neopatentati")
    private Boolean neopatentati;

    @Column(name = "chilometraggio_da")
    private Integer chilometraggioDa;

    @Column(name = "chilometraggio_a")
    private Integer chilometraggioA;

    @Column(name = "cambio")
    private String cambio;

    @Column(name = "porte")
    private Integer porte;

    @Column(name = "prezzo_min")
    private Integer prezzoMin;

    @Column(name = "prezzo_max")
    private Integer prezzoMax;

    @Builder
    public Ricerche(Utente utente, String categoria, String marca, String modello, String carburante,
                    Integer annoDa, Integer annoA, Boolean neopatentati, Integer chilometraggioDa,
                    Integer chilometraggioA, String cambio, Integer porte, Integer prezzoMin, Integer prezzoMax) {
        this.utente = utente;
        this.categoria = categoria;
        this.marca = marca;
        this.modello = modello;
        this.carburante = carburante;
        this.annoDa = annoDa;
        this.annoA = annoA;
        this.neopatentati = neopatentati;
        this.chilometraggioDa = chilometraggioDa;
        this.chilometraggioA = chilometraggioA;
        this.cambio = cambio;
        this.porte = porte;
        this.prezzoMin = prezzoMin;
        this.prezzoMax = prezzoMax;
    }
}