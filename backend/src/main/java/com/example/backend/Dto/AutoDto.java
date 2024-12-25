package com.example.backend.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class AutoDto {
    private Long id;
    private String categoria;
    private String marca;
    private String modello;
    private int anno;
    private String carburante;
    private String cambio;
    private int chilometraggio;
    private int prezzo;
    private int cilindrata;
    private boolean neopatentati;
    private int porte;
    private boolean disponibile;
    private String descrizione;
    private int clickCount;
    private List<ImmagineAutoDto> immagini;
}

