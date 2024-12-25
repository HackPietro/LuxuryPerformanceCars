package com.example.backend.Data.Dao;

import com.example.backend.Data.Entities.Wishlist;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistDao extends JpaRepository<Wishlist, Long> {
    @EntityGraph(attributePaths = {"utente"})
    List<Wishlist> findByUtenteEmail(String email);  // Nuovo metodo per cercare per email
    @EntityGraph(attributePaths = {"utente"})
    Optional<Wishlist> findByUtenteEmailAndAutoId(String email, Long autoId);  // Cerca per email e autoId
}
