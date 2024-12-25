package com.example.backend.Data.Service;

import com.example.backend.Data.Dao.AutoDao;
import com.example.backend.Data.Dao.UtenteDao;
import com.example.backend.Data.Dao.WishlistDao;
import com.example.backend.Data.Entities.Auto;
import com.example.backend.Data.Entities.Utente;
import com.example.backend.Data.Entities.Wishlist;
import com.example.backend.Dto.WishlistDto;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistDao wishlistDao;

    @Autowired
    private UtenteDao utenteDao;

    @Autowired
    private AutoDao autoDao;  // DAO per accedere alle auto

    @Override
    public WishlistDto addToWishlist(String email, Long autoId) {
        // Trova l'utente tramite la sua email
        Utente utente = utenteDao.findOptionalByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        // Trova l'auto tramite il suo ID
        Auto auto = autoDao.findById(autoId)
                .orElseThrow(() -> new RuntimeException("Auto non trovata"));

        // Crea una nuova wishlist
        Wishlist wishlist = new Wishlist();
        wishlist.setUtente(utente);  // Associa l'utente alla wishlist
        wishlist.setAuto(auto);  // Associa l'auto alla wishlist

        // Forza l'inizializzazione delle relazioni
        Hibernate.initialize(wishlist.getUtente());  // Inizializza l'utente
        Hibernate.initialize(wishlist.getAuto());  // Inizializza l'auto

        // Salva la wishlist nel database
        wishlist = wishlistDao.save(wishlist);

        // Restituisci il DTO della wishlist appena creata
        return convertToDto(wishlist);
    }


    @Transactional
    @Override
    public void removeAllForWishlist(String email) {
        List<Wishlist> wishlists = wishlistDao.findByUtenteEmail(email);
        wishlists.forEach(wishlist -> Hibernate.initialize(wishlist.getUtente()));
        wishlistDao.deleteAll(wishlists);
    }

    @Transactional
    @Override
    public void removeItemForWishlist(String email, Long autoId) {
        Wishlist wishlist = wishlistDao.findByUtenteEmailAndAutoId(email, autoId)
                .orElseThrow(() -> new RuntimeException("Elemento non trovato nella wishlist"));
        Hibernate.initialize(wishlist.getUtente());
        wishlistDao.delete(wishlist);
    }

    @Override
    public Collection<WishlistDto> getWishlistAuto(String email) {
        List<Wishlist> wishlists = wishlistDao.findByUtenteEmail(email);
        return wishlists.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Collection<WishlistDto> findAll(int start, int end) {
        List<Wishlist> wishlists = wishlistDao.findAll();
        return wishlists.stream()
                .skip(start)
                .limit(end - start)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public WishlistDto getById(Long id) {
        Wishlist wishlist = wishlistDao.findById(id).orElse(null);
        return convertToDto(wishlist);
    }

    @Override
    public void deleteById(Long id) {
        wishlistDao.deleteById(id);
    }

    @Override
    public WishlistDto create(WishlistDto wishlistDto) {
        Utente utente = utenteDao.findOptionalByEmail(wishlistDto.getUtenteEmail())
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        Auto auto = autoDao.findById(wishlistDto.getAutoId())
                .orElseThrow(() -> new RuntimeException("Auto non trovata"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUtente(utente);
        wishlist.setAuto(auto);

        wishlistDao.save(wishlist);
        return convertToDto(wishlist);
    }

    private WishlistDto convertToDto(Wishlist wishlist) {
        if (wishlist == null) return null;

        WishlistDto wishlistDto = new WishlistDto();
        wishlistDto.setId(wishlist.getId());
        wishlistDto.setUtenteEmail(wishlist.getUtente().getEmail());
        wishlistDto.setAutoId(wishlist.getAuto().getId());

        return wishlistDto;
    }
}
