package com.example.backend.Contoller;

import com.example.backend.Dto.WishlistDto;
import com.example.backend.Data.Service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add")
    public ResponseEntity<WishlistDto> addToWishlist(@RequestParam String email, @RequestParam Long autoId) {
        WishlistDto wishlist = wishlistService.addToWishlist(email, autoId);
        return ResponseEntity.ok(wishlist);
    }

    @DeleteMapping("/removeAll")
    public ResponseEntity<Void> removeAllForWishlist(@RequestParam String email) {
        wishlistService.removeAllForWishlist(email);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/removeItem")
    public ResponseEntity<Void> removeItemForWishlist(@RequestParam String email, @RequestParam Long autoId) {
        wishlistService.removeItemForWishlist(email, autoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/auto")
    public ResponseEntity<Collection<WishlistDto>> getWishlistAuto(@RequestParam String email) {
        Collection<WishlistDto> wishlistProducts = wishlistService.getWishlistAuto(email);
        return ResponseEntity.ok(wishlistProducts);
    }

    @PostMapping("create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<WishlistDto> createWishlist(@RequestBody WishlistDto wishlistDto) {
        WishlistDto createdWishlist = wishlistService.create(wishlistDto);
        return ResponseEntity.ok(createdWishlist);
    }

    @GetMapping("/findAll")
    public ResponseEntity<Collection<WishlistDto>> findAll(
            @RequestParam int start,
            @RequestParam int end,
            @RequestParam(required = false) String email) {  // Modificato per email
        Collection<WishlistDto> wishlists = wishlistService.findAll(start, end);
        // Filtrare per `email` se fornita
        if (email != null) {
            wishlists = wishlists.stream()
                    .filter(wishlist -> wishlist.getUtenteEmail().equals(email))  // Filtra per email
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(wishlists);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<WishlistDto> getById(@PathVariable Long id) {
        WishlistDto wishlist = wishlistService.getById(id);
        return wishlist != null ? ResponseEntity.ok(wishlist) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        wishlistService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
