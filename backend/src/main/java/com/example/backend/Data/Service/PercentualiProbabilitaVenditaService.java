package com.example.backend.Data.Service;

import com.example.backend.Data.Entities.PercentualiProbabilitaVendita;

import java.util.List;

public interface PercentualiProbabilitaVenditaService {
    List<Object[]> getSuccessoVenditaById(Long id);
    Integer getMaxNumeroValore();
    void addProbabilitaVendita(int numeroValore, double percentuale, Long autoId);
}
