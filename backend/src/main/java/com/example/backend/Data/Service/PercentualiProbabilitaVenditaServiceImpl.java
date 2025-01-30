package com.example.backend.Data.Service;

import com.example.backend.Data.Dao.AutoDao;
import com.example.backend.Data.Dao.PercentualiProbabilitaVenditaDao;
import com.example.backend.Data.Entities.Auto;
import com.example.backend.Data.Entities.PercentualiProbabilitaVendita;
import com.example.backend.Data.Service.PercentualiProbabilitaVenditaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PercentualiProbabilitaVenditaServiceImpl implements PercentualiProbabilitaVenditaService {

    private final PercentualiProbabilitaVenditaDao probabilitaVenditaDao;
    private final AutoDao autoDao;

    @Override
    public List<Object[]> getSuccessoVenditaById(Long id) {
        return probabilitaVenditaDao.getSuccessoVenditaByAutoId(id);
    }

    @Override
    public Integer getMaxNumeroValore() {
        return probabilitaVenditaDao.findMaxNumeroValore();
    }

    @Override
    public void addProbabilitaVendita(int numeroValore, double percentuale, Long autoId) {
        // Recupera l'auto usando l'autoDao (direttamente da JPA)
        Auto auto = autoDao.findById(autoId).orElseThrow(() ->
                new RuntimeException("Auto con ID " + autoId + " non trovata"));

        // Crea una nuova istanza di PercentualiProbabilitaVendita
        PercentualiProbabilitaVendita probabilita = new PercentualiProbabilitaVendita();
        probabilita.setNumeroValore(numeroValore);
        probabilita.setPercentuale(percentuale);
        probabilita.setAuto(auto);

        // Salva l'oggetto nel database
        probabilitaVenditaDao.save(probabilita);
    }
}
