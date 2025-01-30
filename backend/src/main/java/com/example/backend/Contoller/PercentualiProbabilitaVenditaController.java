package com.example.backend.Contoller;

import com.example.backend.Data.Entities.PercentualiProbabilitaVendita;
import com.example.backend.Data.Service.PercentualiProbabilitaVenditaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/probabilita-vendita")
@RequiredArgsConstructor
public class PercentualiProbabilitaVenditaController {

    private final PercentualiProbabilitaVenditaService probabilitaVenditaService;

    @GetMapping("/getSuccessoVenditaById/{id}")
    public ResponseEntity<List<Object[]>> getSuccessoVenditaById(@PathVariable Long id) {
        System.out.println("sono dentro entro");
        List<Object[]> result = probabilitaVenditaService.getSuccessoVenditaById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getMaxNumeroValore")
    public ResponseEntity<Integer> getMaxNumeroValore() {
        Integer maxNumeroValore = probabilitaVenditaService.getMaxNumeroValore();
        return ResponseEntity.ok(maxNumeroValore);
    }

    @PostMapping("/addProbabilitaVendita")
    public ResponseEntity<String> addProbabilitaVendita(
            @RequestParam("numeroValore") int numeroValore,
            @RequestParam("percentuale") double percentuale,
            @RequestParam("autoId") Long autoId) {

        try {
            probabilitaVenditaService.addProbabilitaVendita(numeroValore, percentuale, autoId);
            return ResponseEntity.ok("Probabilità di vendita aggiunta correttamente.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Errore nell'aggiungere la probabilità di vendita: " + e.getMessage());
        }
    }
}
