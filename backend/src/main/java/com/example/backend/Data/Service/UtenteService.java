package com.example.backend.Data.Service;

import com.example.backend.Dto.UtenteDto;
import java.util.List;

public interface UtenteService {
    List<UtenteDto> findAll();
    UtenteDto getById(Long id);
    UtenteDto getByEmail(String email);
    UtenteDto saveUtente(UtenteDto utenteDto);
    UtenteDto updateUtenteByEmail(String email, UtenteDto utenteDto);
    void deleteById(Long id);
    void deleteByEmail(String email);

    void setUserType(String email, String tipologia);
}
