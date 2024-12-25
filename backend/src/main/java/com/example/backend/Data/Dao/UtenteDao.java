package com.example.backend.Data.Dao;

import com.example.backend.Data.Entities.Utente;
import com.example.backend.Dto.UtenteDto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtenteDao extends JpaRepository<Utente, Long> {
    Utente findByEmail(String email);
    Optional<Utente> findOptionalByEmail(String email);

    void deleteByEmail(String email);

    default boolean saveOrUpdate(Utente utente) {
        try {
            this.save(utente); // `save` will update if `utente` has a non-null ID
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Modifying
    @Transactional
    @Query("UPDATE Utente u SET u.nome = :nome, u.cognome = :cognome, u.password = :password, u.tipologia = :tipologia WHERE u.email = :email")
    int updateUtenteByEmail(
            @Param("email") String email,
            @Param("nome") String nome,
            @Param("cognome") String cognome,
            @Param("password") String password,
            @Param("tipologia") String tipologia
    );


}
