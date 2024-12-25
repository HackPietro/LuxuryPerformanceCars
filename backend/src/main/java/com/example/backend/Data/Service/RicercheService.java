package com.example.backend.Data.Service;

import com.example.backend.Data.Entities.Ricerche;
import com.example.backend.Data.Entities.Utente;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface RicercheService {
    void saveSearch(Utente utente, Map<String, String> criteri);
    ResponseEntity<List<String>> getMarche();
    ResponseEntity<List<Integer>> getPrezziMin();
    ResponseEntity<List<Integer>> getPrezziMax();
    ResponseEntity<List<Integer>> getPorte();
    ResponseEntity<List<Boolean>> getNeopatentati();
    ResponseEntity<List<Integer>> getKmMin();
    ResponseEntity<List<Integer>> getKmMax();
    ResponseEntity<List<Integer>> getAnnoMin();
    ResponseEntity<List<Integer>> getAnnoMax();
    ResponseEntity<List<String>> getCambio();
    ResponseEntity<List<String>> getCarburante();
    ResponseEntity<List<String>> getCategoria();
    ResponseEntity<List<String>> getModelliDiUnaMarca(String marca);


}
