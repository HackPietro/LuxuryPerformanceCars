package com.example.backend.Data.Dao;

import com.example.backend.Data.Entities.Ricerche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RicercheDao extends JpaRepository <Ricerche, Long>, JpaSpecificationExecutor {
    @Query("SELECT r.marca FROM Ricerche r WHERE r.marca IS NOT NULL")
    List<String> findMarche();

    @Query("SELECT r.prezzoMin FROM Ricerche r WHERE r.prezzoMin IS NOT NULL")
    List<Integer> findPrezziMin();

    @Query("SELECT r.prezzoMax FROM Ricerche r WHERE r.prezzoMax IS NOT NULL")
    List<Integer> findPrezziMax();

    @Query("SELECT r.porte FROM Ricerche r WHERE r.porte IS NOT NULL")
    List<Integer> findPorte();

    @Query("SELECT r.neopatentati FROM Ricerche r WHERE r.neopatentati IS NOT NULL")
    List<Boolean> findNeopatentati();

    @Query("SELECT r.chilometraggioDa FROM Ricerche r WHERE r.chilometraggioDa IS NOT NULL")
    List<Integer> findKmMin();

    @Query("SELECT r.chilometraggioA FROM Ricerche r WHERE r.chilometraggioA IS NOT NULL")
    List<Integer> findKmMax();

    @Query("SELECT r.annoDa FROM Ricerche r WHERE r.annoDa IS NOT NULL")
    List<Integer> findAnnoMin();

    @Query("SELECT r.annoA FROM Ricerche r WHERE r.annoA IS NOT NULL")
    List<Integer> findAnnoMax();

    @Query("SELECT r.cambio FROM Ricerche r WHERE r.cambio IS NOT NULL")
    List<String> findCambio();

    @Query("SELECT r.carburante FROM Ricerche r WHERE r.carburante IS NOT NULL")
    List<String> findCarburante();

    @Query("SELECT r.categoria FROM Ricerche r WHERE r.categoria IS NOT NULL")
    List<String> findCategoria();

    @Query("SELECT r.modello FROM Ricerche r WHERE r.marca = :marca AND r.modello IS NOT NULL")
    List<String> findModelliDiUnaMarca(@Param("marca") String marca);

}
