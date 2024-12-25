package com.example.backend.Data.Service;

import com.example.backend.Data.Dao.AutoDao;
import com.example.backend.Data.Dao.ImmagineAutoDao;
import com.example.backend.Data.Entities.Auto;
import com.example.backend.Data.Entities.ImmagineAuto;
import com.example.backend.Data.Entities.Utente;
import com.example.backend.Data.Dao.UtenteDao;
import com.example.backend.Dto.AutoDto;
import com.example.backend.Dto.ImmagineAutoDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AutoServiceImpl implements AutoService {

    private final AutoDao autoDao;
    private final UtenteDao utenteDao;
    private final ImmagineAutoDao immagineAutoDao;
    private final ModelMapper modelMapper;
    private final EntityManager entityManager;
    private final RicercheService ricercheService;

    @Override
    public void saveOrUpdate(AutoDto autoDto) {
        Auto auto = modelMapper.map(autoDto, Auto.class);
        autoDao.save(auto);
    }

    @Override
    public ResponseEntity<List<AutoDto>> getAllEntries() {
        List<Auto> autoList = autoDao.findAll();
        List<AutoDto> autoDtoList = autoList.stream()
                .map(this::convertToAutoDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(autoDtoList);
    }

    private AutoDto convertToAutoDto(Auto auto) {
        AutoDto autoDto = modelMapper.map(auto, AutoDto.class);
        List<ImmagineAuto> immagini = immagineAutoDao.findByAutoId(auto.getId());
        List<ImmagineAutoDto> immaginiDto = immagini.stream()
                .map(this::convertToImmagineAutoDto)
                .collect(Collectors.toList());
        autoDto.setImmagini(immaginiDto);
        return autoDto;
    }

    private ImmagineAutoDto convertToImmagineAutoDto(ImmagineAuto immagineAuto) {
        return modelMapper.map(immagineAuto, ImmagineAutoDto.class);
    }

    @Override
    public ResponseEntity<AutoDto> getById(Long id) {
        Optional<Auto> optionalAuto = autoDao.findById(id);
        return optionalAuto.map(auto -> ResponseEntity.ok(convertToAutoDto(auto)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    @Transactional
    public void incrementClickCount(Long autoId) {
        Auto auto = autoDao.findById(autoId)
                .orElseThrow(() -> new EntityNotFoundException("Auto non trovata con ID: " + autoId));
        auto.setClickCount(auto.getClickCount() + 1);
        autoDao.save(auto);
    }

    @Override
    public ResponseEntity<List<AutoDto>> findCategoryAuto(String categoria) {
        List<Auto> autoList = autoDao.findByCategoria(categoria);
        List<AutoDto> autoDtoList = autoList.stream()
                .map(this::convertToAutoDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(autoDtoList);
    }

    @Override
    @Transactional
    public ResponseEntity<List<AutoDto>> searchAutoByCriteria(Map<String, String> criteri, String utenteEmail) {
        // Salva la ricerca nel database solo se l'utenteEmail è "nullo"
        if ("nullo".equals(utenteEmail)) {
            // Salva la ricerca con utente null
            ricercheService.saveSearch(null, criteri);
        } else {
            Optional<Utente> optionalUtente = utenteDao.findOptionalByEmail(utenteEmail);

            if (optionalUtente.isPresent()) {
                Utente utente = optionalUtente.get();
                ricercheService.saveSearch(utente, criteri);
            } else {
                return ResponseEntity.notFound().build();
            }
        }

        // Rimuovi il campo "email" dai criteri
        criteri.remove("email");

        // Costruisci la query per la ricerca delle auto
        StringBuilder queryStr = new StringBuilder("SELECT a FROM Auto a WHERE 1=1");
        Map<String, Object> parametri = new HashMap<>();

        // Aggiungi i criteri dinamicamente
        criteri.forEach((chiave, valore) -> {
            if ("neopatentati".equals(chiave)) {
                queryStr.append(" AND a.neopatentati = :neopatentati");
                parametri.put("neopatentati", Boolean.parseBoolean(valore));
            } else if ("categoria".equals(chiave)) {
                queryStr.append(" AND a.categoria = :categoria");
                parametri.put("categoria", valore);
            } else if ("annoDa".equals(chiave)) {
                queryStr.append(" AND a.anno >= :annoDa");
                parametri.put("annoDa", Integer.parseInt(valore));
            } else if ("annoA".equals(chiave)) {
                queryStr.append(" AND a.anno <= :annoA");
                parametri.put("annoA", Integer.parseInt(valore));
            } else if ("chilometraggioDa".equals(chiave)) {
                queryStr.append(" AND a.chilometraggio >= :chilometraggioDa");
                parametri.put("chilometraggioDa", Integer.parseInt(valore));
            } else if ("chilometraggioA".equals(chiave)) {
                queryStr.append(" AND a.chilometraggio <= :chilometraggioA");
                parametri.put("chilometraggioA", Integer.parseInt(valore));
            } else if ("prezzoMin".equals(chiave)) {
                queryStr.append(" AND a.prezzo >= :prezzoMin");
                parametri.put("prezzoMin", Double.parseDouble(valore));
            } else if ("prezzoMax".equals(chiave)) {
                queryStr.append(" AND a.prezzo <= :prezzoMax");
                parametri.put("prezzoMax", Double.parseDouble(valore));
            } else {
                // Aggiungi un filtro generico per altri campi
                queryStr.append(" AND a.").append(chiave).append(" = :").append(chiave);
                parametri.put(chiave, valore);
            }
        });

        // Crea la query
        Query query = entityManager.createQuery(queryStr.toString(), Auto.class);

        // Imposta i parametri nella query
        parametri.forEach(query::setParameter);

        // Esegui la query per ottenere i risultati
        List<Auto> autoList = query.getResultList();

        // Mappa le auto in AutoDto
        List<AutoDto> autoDtoList = autoList.stream()
                .map(this::convertToAutoDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(autoDtoList);  // Restituisci i risultati come una lista di DTO
    }


    @Override
    public ResponseEntity<Object> deleteById(Long id) {
        if (autoDao.existsById(id)) {
            autoDao.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<List<String>> getMarche() {
        List<String> marche = autoDao.findDistinctMarche();
        return ResponseEntity.ok(marche);
    }

    @Override
    public ResponseEntity<List<String>> getModelliByMarca(String marca) {
        List<String> modelli = autoDao.findModelliByMarca(marca);
        if (modelli.isEmpty()) {
            return ResponseEntity.notFound().build(); // Restituisce 404 se non ci sono modelli
        }
        return ResponseEntity.ok(modelli);
    }


    public ResponseEntity<List<Map<Integer, Integer>>> findByMarcaAndModello(String marca, String modello) {
        if (marca == null || marca.trim().isEmpty() || modello == null || modello.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Risposta 400 se i parametri non sono validi
        }

        List<Auto> autoList = autoDao.findByMarcaAndModello(marca, modello);

        if (autoList.isEmpty()) {
            return ResponseEntity.noContent().build(); // Risposta 204 se non ci sono risultati
        }

        // Crea una lista di mappe con Integer come chiave e Integer come valore
        List<Map<Integer, Integer>> result = autoList.stream()
                .map(auto -> {
                    Map<Integer, Integer> map = new HashMap<>();
                    // Cast esplicito a Integer per l'id
                    map.put(auto.getId().intValue(), auto.getClickCount()); // id è Long, lo castiamo a Integer
                    return map;
                })
                .collect(Collectors.toList());

        System.out.println(result);
        return ResponseEntity.ok(result); // Risposta

    }

    @Override
    public ResponseEntity<AutoDto> addAuto(AutoDto autoDto) {
        Auto auto = modelMapper.map(autoDto, Auto.class);

        Auto savedAuto = autoDao.save(auto);

        AutoDto savedAutoDto = convertToAutoDto(savedAuto);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedAutoDto);
    }

    @Override
    public ResponseEntity<Void> deleteAuto(Long autoId) {
        if (autoDao.existsById(autoId)) {
            autoDao.deleteById(autoId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // 204 No Content, cancellazione riuscita
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // 404 Not Found, auto non trovata
        }
    }





}
