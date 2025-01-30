package com.example.backend.Data.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "probabilita_successo_vendita")
@Data
@NoArgsConstructor
public class PercentualiProbabilitaVendita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "auto_id", nullable = false)
    private Auto auto;  // Relazione Many-to-One con Auto

    @Column(name = "numero_valore", nullable = false)
    private int numeroValore;

    @Column(name = "percentuale", nullable = false)
    private double percentuale;

}
