package com.example.backend.Data.Service;

import com.example.backend.Dto.AutoDto;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface AutoService {
    void saveOrUpdate(AutoDto autoDto); // Metodo per salvare o aggiornare un'auto
    ResponseEntity<List<AutoDto>> getAllEntries(); // Metodo per ottenere tutte le auto
    ResponseEntity<AutoDto> getById(Long id); // Metodo per ottenere un'auto per ID
    void incrementClickCount(Long autoId);
    ResponseEntity<List<AutoDto>> findCategoryAuto(String categoria); // Metodo per ottenere auto per categoria
    ResponseEntity<List<AutoDto>> searchAutoByCriteria(Map<String, String> criteri, String email); // Nuovo metodo
    ResponseEntity<Object> deleteById(Long id); // Metodo per eliminare un'auto
    ResponseEntity<List<String>> getMarche();
    ResponseEntity<List<String>> getModelliByMarca(String marca);
    ResponseEntity<List<Map<Integer, Integer>>> findByMarcaAndModello(String marca, String modello);
    ResponseEntity<AutoDto> addAuto(AutoDto autoDto);
    ResponseEntity<Void> deleteAuto(Long autoId);


}
