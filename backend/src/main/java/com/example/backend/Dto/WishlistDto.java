package com.example.backend.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class WishlistDto {
    private Long id;
    private String utenteEmail;
    private Long autoId;
}
