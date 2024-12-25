package com.example.backend.Data.Service;

import com.example.backend.Data.Dao.UtenteDao;
import com.example.backend.Data.Entities.Utente;
import com.example.backend.Dto.UtenteDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtenteServiceImpl implements UtenteService {

    @Autowired
    private UtenteDao utenteDao;

    @Override
    public List<UtenteDto> findAll() {
        List<Utente> utenti = utenteDao.findAll();
        return utenti.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UtenteDto getById(Long id) {
        Utente utente = utenteDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utente con ID " + id + " non trovato"));
        return convertToDto(utente);
    }

    @Override
    public UtenteDto getByEmail(String email) {
        Utente utente = utenteDao.findByEmail(email); // Aggiungi questo metodo nel tuo DAO
        return utente != null ? convertToDto(utente) : null; // Converte a UtenteDto
    }

    @Override
    public UtenteDto saveUtente(UtenteDto utenteDto) {
        Utente utente = convertToEntity(utenteDto);
        Utente savedUtente = utenteDao.save(utente);
        return convertToDto(savedUtente);
    }

    @Override
    public UtenteDto updateUtenteByEmail(String email, UtenteDto utenteDto) {
        Utente existingUtente = utenteDao.findByEmail(email);
        if (existingUtente == null) {
            throw new EntityNotFoundException("Utente con email " + email + " non trovato");
        }

        existingUtente.setEmail(utenteDto.getEmail());
        existingUtente.setNome(utenteDto.getNome());
        existingUtente.setCognome(utenteDto.getCognome());
        existingUtente.setTipologia(utenteDto.getTipologia()); // Cambiato da setIsAdmin a setTipologia

        Utente updatedUtente = utenteDao.save(existingUtente);
        return convertToDto(updatedUtente);
    }



    @Override
    public void deleteById(Long id) {
        if (!utenteDao.existsById(id)) {
            throw new EntityNotFoundException("Utente con ID " + id + " non esiste");
        }
        utenteDao.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteByEmail(String email) {
        Utente utente = utenteDao.findByEmail(email);
        if (utente == null) {
            throw new EntityNotFoundException("Utente con email " + email + " non trovato");
        }
        utenteDao.deleteByEmail(email); // Assicurati che questo metodo esista nel DAO
    }

    @Override
    public void setUserType(String email, String tipologia) { // Cambiato il tipo a String
        Utente utente = utenteDao.findByEmail(email);
        if (utente == null) {
            throw new EntityNotFoundException("Utente con email " + email + " non trovato");
        }
        utente.setTipologia(tipologia); // Imposta il nuovo valore di tipologia
        utenteDao.save(utente);
    }



    // Metodo per convertire da Utente a UtenteDto
    private UtenteDto convertToDto(Utente utente) {
        UtenteDto utenteDto = new UtenteDto();
        utenteDto.setId(utente.getId());
        utenteDto.setEmail(utente.getEmail());
        utenteDto.setNome(utente.getNome());
        utenteDto.setCognome(utente.getCognome());
        utenteDto.setTipologia(utente.getTipologia()); // Cambiato da setIsAdmin a setTipologia
        return utenteDto;
    }


    // Metodo per convertire da UtenteDto a Utente
    private Utente convertToEntity(UtenteDto utenteDto) {
        Utente utente = new Utente();
        utente.setId(utenteDto.getId());
        utente.setEmail(utenteDto.getEmail());
        utente.setNome(utenteDto.getNome());
        utente.setCognome(utenteDto.getCognome());
        utente.setTipologia(utenteDto.getTipologia()); // Cambiato da setIsAdmin a setTipologia
        return utente;
    }

}
