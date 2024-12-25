package com.example.backend.Data.Service;

import com.example.backend.Dto.WishlistDto;

import java.util.Collection;
import java.util.List;

public interface WishlistService {
    Collection<WishlistDto> findAll(int start, int end);
    WishlistDto getById(Long id);
    void deleteById(Long id);
    WishlistDto create(WishlistDto wishlistDto);
    WishlistDto addToWishlist(String email, Long autoId);
    void removeAllForWishlist(String email);
    void removeItemForWishlist(String email, Long autoId);
    Collection<WishlistDto> getWishlistAuto(String email);
}


