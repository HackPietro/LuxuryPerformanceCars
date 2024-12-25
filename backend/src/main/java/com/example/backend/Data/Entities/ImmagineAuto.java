package com.example.backend.Data.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="immagine_auto")
@Data
@NoArgsConstructor
public class ImmagineAuto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "auto_id", nullable = false)
    private Auto auto;

    @Column(name = "base64", columnDefinition = "TEXT", nullable = false)
    private String base64;
}
