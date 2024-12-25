package com.example.backend.Data.Dao;

import com.example.backend.Data.Entities.Auto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutoDao extends JpaRepository<Auto, Long>, JpaSpecificationExecutor {
    List<Auto> findByCategoria(String categoria); // Metodo per trovare auto per categoria
    @Query("SELECT DISTINCT a.marca FROM Auto a")
    List<String> findDistinctMarche();
    @Query("SELECT DISTINCT a.modello FROM Auto a WHERE a.marca = :marca")
    List<String> findModelliByMarca(@Param("marca") String marca);
    @Query("SELECT a FROM Auto a WHERE a.marca = :marca AND a.modello = :modello")
    List<Auto> findByMarcaAndModello(@Param("marca") String marca, @Param("modello") String modello);


}
