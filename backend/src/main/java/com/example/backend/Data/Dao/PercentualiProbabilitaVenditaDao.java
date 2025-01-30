package com.example.backend.Data.Dao;

import com.example.backend.Data.Entities.PercentualiProbabilitaVendita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PercentualiProbabilitaVenditaDao extends JpaRepository<PercentualiProbabilitaVendita, Long> {

    // Query per ottenere il successo di vendita basato sull'ID dell'auto
    @Query("SELECT p.numeroValore, p.percentuale FROM PercentualiProbabilitaVendita p WHERE p.auto.id = :autoId")
    List<Object[]> getSuccessoVenditaByAutoId(Long autoId);

    @Query("SELECT MAX(p.numeroValore) FROM PercentualiProbabilitaVendita p")
    Integer findMaxNumeroValore();
}
