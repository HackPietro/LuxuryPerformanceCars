package com.example.backend.Data.Dao;

import com.example.backend.Data.Entities.ImmagineAuto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImmagineAutoDao extends JpaRepository<ImmagineAuto, Long> {
    List<ImmagineAuto> findByAutoId(Long autoId); // Metodo per trovare le immagini per ID auto
    void deleteByAutoId(Long autoId);


}
