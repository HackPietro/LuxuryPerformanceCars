package com.example.backend.Contoller;

import com.example.backend.Data.Service.RicercheService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/ricerche")
@RequiredArgsConstructor
public class RicercheController {

    private final RicercheService ricercheService;

    @GetMapping("/marche")
    public ResponseEntity<List<String>> getMarche() {
        return ricercheService.getMarche();
    }

    @GetMapping("/prezziMin")
    public ResponseEntity<List<Integer>> getPrezziMin() {
        return ricercheService.getPrezziMin();
    }

    @GetMapping("/prezziMax")
    public ResponseEntity<List<Integer>> getPrezziMax() {
        return ricercheService.getPrezziMax();
    }

    @GetMapping("/porte")
    public ResponseEntity<List<Integer>> getPorte() {
        return ricercheService.getPorte();
    }

    @GetMapping("/neopatentati")
    public ResponseEntity<List<Boolean>> getNeopatentati() {
        return ricercheService.getNeopatentati();
    }

    @GetMapping("/kmMin")
    public ResponseEntity<List<Integer>> getKmMin() {
        return ricercheService.getKmMin();
    }

    @GetMapping("/kmMax")
    public ResponseEntity<List<Integer>> getKmMax() {
        return ricercheService.getKmMax();
    }

    @GetMapping("/annoMin")
    public ResponseEntity<List<Integer>> getAnnoMin() {
        return ricercheService.getAnnoMin();
    }

    @GetMapping("/annoMax")
    public ResponseEntity<List<Integer>> getAnnoMax() {
        return ricercheService.getAnnoMax();
    }

    @GetMapping("/cambio")
    public ResponseEntity<List<String>> getCambio() {
        return ricercheService.getCambio();
    }

    @GetMapping("/carburante")
    public ResponseEntity<List<String>> getCarburante() {
        return ricercheService.getCarburante();
    }

    @GetMapping("/categoria")
    public ResponseEntity<List<String>> getCategoria() {
        return ricercheService.getCategoria();
    }

    @GetMapping("/modelliDiUnaMarca")
    public ResponseEntity<List<String>> getModelliDiUnaMarca(String marca) { return ricercheService.getModelliDiUnaMarca(marca); }
}

