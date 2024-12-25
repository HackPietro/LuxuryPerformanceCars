package com.example.backend.Data.Service;

import com.example.backend.Data.Dao.RicercheDao;
import com.example.backend.Data.Entities.Ricerche;
import com.example.backend.Data.Entities.Utente;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RicercheServiceImpl implements RicercheService {

    private final RicercheDao ricercheDao;

    @Override
    public void saveSearch(Utente utente, Map<String, String> criteri) {
        Ricerche ricerca = Ricerche.builder()
                .utente(utente)
                .categoria(criteri.get("categoria"))
                .marca(criteri.get("marca"))
                .modello(criteri.get("modello"))
                .carburante(criteri.get("carburante"))
                .annoDa(criteri.containsKey("annoDa") ? Integer.parseInt(criteri.get("annoDa")) : null)
                .annoA(criteri.containsKey("annoA") ? Integer.parseInt(criteri.get("annoA")) : null)
                .neopatentati(criteri.containsKey("neopatentati") ? Boolean.parseBoolean(criteri.get("neopatentati")) : null)
                .chilometraggioDa(criteri.containsKey("chilometraggioDa") ? Integer.parseInt(criteri.get("chilometraggioDa")) : null)
                .chilometraggioA(criteri.containsKey("chilometraggioA") ? Integer.parseInt(criteri.get("chilometraggioA")) : null)
                .cambio(criteri.get("cambio"))
                .porte(criteri.containsKey("porte") ? Integer.parseInt(criteri.get("porte")) : null)
                .prezzoMin(criteri.containsKey("prezzoMin") ? Integer.parseInt(criteri.get("prezzoMin")) : null)
                .prezzoMax(criteri.containsKey("prezzoMax") ? Integer.parseInt(criteri.get("prezzoMax")) : null)
                .build();

        ricercheDao.save(ricerca);
    }

    @Override
    public ResponseEntity<List<String>> getMarche() {
        List<String> marche = ricercheDao.findMarche();
        return ResponseEntity.ok(marche);
    }

    @Override
    public ResponseEntity<List<Integer>> getPrezziMin() {
        List<Integer> prezziMin = ricercheDao.findPrezziMin();
        return ResponseEntity.ok(prezziMin);
    }

    @Override
    public ResponseEntity<List<Integer>> getPrezziMax() {
        List<Integer> prezziMax = ricercheDao.findPrezziMax();
        return ResponseEntity.ok(prezziMax);
    }

    @Override
    public ResponseEntity<List<Integer>> getPorte() {
        List<Integer> porte = ricercheDao.findPorte();
        return ResponseEntity.ok(porte);
    }

    @Override
    public ResponseEntity<List<Boolean>> getNeopatentati() {
        List<Boolean> neopatentati = ricercheDao.findNeopatentati();
        return ResponseEntity.ok(neopatentati);
    }

    @Override
    public ResponseEntity<List<Integer>> getKmMin() {
        List<Integer> kmMin = ricercheDao.findKmMin();
        return ResponseEntity.ok(kmMin);
    }

    @Override
    public ResponseEntity<List<Integer>> getKmMax() {
        List<Integer> kmMax = ricercheDao.findKmMax();
        return ResponseEntity.ok(kmMax);
    }

    @Override
    public ResponseEntity<List<Integer>> getAnnoMin() {
        List<Integer> annoMin = ricercheDao.findAnnoMin();
        return ResponseEntity.ok(annoMin);
    }

    @Override
    public ResponseEntity<List<Integer>> getAnnoMax() {
        List<Integer> annoMax = ricercheDao.findAnnoMax();
        return ResponseEntity.ok(annoMax);
    }

    @Override
    public ResponseEntity<List<String>> getCambio() {
        List<String> cambio = ricercheDao.findCambio();
        return ResponseEntity.ok(cambio);
    }

    @Override
    public ResponseEntity<List<String>> getCarburante() {
        List<String> carburante = ricercheDao.findCarburante();
        return ResponseEntity.ok(carburante);
    }

    @Override
    public ResponseEntity<List<String>> getCategoria() {
        List<String> categoria = ricercheDao.findCategoria();
        return ResponseEntity.ok(categoria);
    }

    @Override
    public ResponseEntity<List<String>> getModelliDiUnaMarca(String marca) {
        List<String> modelli = ricercheDao.findModelliDiUnaMarca(marca);
        return ResponseEntity.ok(modelli);
    }

}
