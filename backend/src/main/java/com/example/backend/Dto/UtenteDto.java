package com.example.backend.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UtenteDto {
    private Long id;
    private String email;
    private String password;
    private String nome;
    private String cognome;
    private String tipologia;
    private WishlistDto wishlist;
}
