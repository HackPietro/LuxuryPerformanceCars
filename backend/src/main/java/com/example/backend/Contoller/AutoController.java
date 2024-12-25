package com.example.backend.Contoller;

import com.example.backend.Data.Service.ImmagineAutoService;
import com.example.backend.Dto.AutoDto;
import com.example.backend.Data.Service.AutoService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/auto")
@RequiredArgsConstructor
public class AutoController {

    private final AutoService autoService;
    private final ImmagineAutoService immagineAutoService;

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AutoDto> saveOrUpdateAuto(@RequestBody AutoDto autoDto) {
        autoService.saveOrUpdate(autoDto);
        return ResponseEntity.ok(autoDto);
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<AutoDto>> findAll() {
        return autoService.getAllEntries();
    }

    @GetMapping("/findCategoryAuto/{categoria}")
    public ResponseEntity<List<AutoDto>> findCategoryAuto(@PathVariable String categoria) {
        return autoService.findCategoryAuto(categoria);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<AutoDto> getById(@PathVariable Long id) {
        return autoService.getById(id);
    }

    @PostMapping("/{id}/increment-click")
    public ResponseEntity<Void> incrementClickCount(@PathVariable Long id) {
        autoService.incrementClickCount(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Object> deleteById(@PathVariable Long id) {
        return autoService.deleteById(id);
    }

    // Nuovo endpoint per la ricerca dinamica
    @GetMapping("/search")
    public ResponseEntity<List<AutoDto>> searchAuto(@RequestParam Map<String, String> criteri, @RequestParam String email) {
        return autoService.searchAutoByCriteria(criteri, email);
    }

    @GetMapping("/marche")
    public ResponseEntity<List<String>> getMarche() {
        return autoService.getMarche();
    }

    @GetMapping("/modelli")
    public ResponseEntity<List<String>> getModelliByMarca(@RequestParam String marca) {
        return autoService.getModelliByMarca(marca);
    }

    @GetMapping("/findByMarcaAndModello")
    public ResponseEntity<List<Map<Integer, Integer>>> findByMarcaAndModello(
            @RequestParam String marca,
            @RequestParam String modello) {
        System.out.println(marca);
        System.out.println(modello);
        return autoService.findByMarcaAndModello(marca, modello);
    }

    @PostMapping("/{autoId}/aggiungi-immagine")
    public ResponseEntity<String> addImmagineAuto(@PathVariable Long autoId, @RequestBody String base64Image) {
        // Chiamata al service per aggiungere l'immagine
        boolean success = immagineAutoService.addImmagineAuto(autoId, base64Image);
        if (success) {
            return ResponseEntity.ok("Immagine aggiunta con successo");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Errore nell'aggiungere l'immagine");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<AutoDto> addAuto(@RequestBody AutoDto autoDto) {
        return autoService.addAuto(autoDto);
    }

    @DeleteMapping("/{autoId}/elimina")
    public ResponseEntity<Void> deleteAuto(@PathVariable Long autoId) {
        return autoService.deleteAuto(autoId);
    }

    @DeleteMapping("/{autoId}/elimina-immagine")
    public ResponseEntity<Void> deleteImmagineAuto(@PathVariable Long autoId) {
        try {
            immagineAutoService.deleteByAutoId(autoId);
            return ResponseEntity.noContent().build(); // 204 No Content per indicare che è andato tutto bene
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }



}
