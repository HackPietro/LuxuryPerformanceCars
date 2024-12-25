package com.example.backend.Contoller;

import com.example.backend.Data.Dao.UtenteDao;
import com.example.backend.Data.Entities.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RegistrationController {

    private final UtenteDao udao;

    @Autowired
    public RegistrationController(UtenteDao udao) {
        this.udao = udao;
    }

    @PostMapping("/doRegistration")
    public String doRegistration(@RequestParam("email") String email,
                                 @RequestParam("password") String password,
                                 @RequestParam("name") String name,
                                 @RequestParam("surname") String surname,
                                 Model model) {

        Utente utente = udao.findByEmail(email);

        if (utente == null) {
            // Create a new user as a regular user (isAdmin = false)
            Utente newUtente = new Utente(email, password, name, surname, "utente");
            boolean reg = udao.saveOrUpdate(newUtente);

            if (reg) {
                // Registration successful: add success message to model
                model.addAttribute("successMessage", "Utente registrato con successo! Effettua il login per procedere.");
            } else {
                // Registration failed: add error message to model
                model.addAttribute("errorMessage", "Server error!");
            }
        } else {
            // User already exists: add error message to model
            model.addAttribute("errorMessage", "Utente già esistente!");
        }
        return "registration";
    }
}
