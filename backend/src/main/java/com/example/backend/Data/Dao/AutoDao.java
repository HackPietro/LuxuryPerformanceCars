package com.example.backend.Data.Dao;

import com.example.backend.Data.Entities.Auto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutoDao extends JpaRepository<Auto, Long>, JpaSpecificationExecutor {
    List<Auto> findByCategoria(String categoria); // Metodo per trovare auto per categoria
    @Query("SELECT a FROM Auto a WHERE a.disponibile = true")
    List<Auto> findAllDisponibili();
    @Query("SELECT DISTINCT a.marca FROM Auto a")
    List<String> findDistinctMarche();
    @Query("SELECT DISTINCT a.modello FROM Auto a WHERE a.marca = :marca")
    List<String> findModelliByMarca(@Param("marca") String marca);
    @Query("SELECT a FROM Auto a WHERE a.marca = :marca AND a.modello = :modello")
    List<Auto> findByMarcaAndModello(@Param("marca") String marca, @Param("modello") String modello);
    @Modifying
    @Query("UPDATE Auto a SET a.disponibile = :disponibile WHERE a.id = :id")
    int updateDisponibile(@Param("id") Long id, @Param("disponibile") boolean disponibile);
    @Query("SELECT a.id FROM Auto a WHERE a.marca = :marca AND a.modello = :modello")
    List<Long> findIdsByBrandAndModel(@Param("marca") String marca, @Param("modello") String modello);
    @Query("SELECT a.id FROM Auto a WHERE a.disponibile = true")
    List<Long> findAllIdDisponibili();




}
