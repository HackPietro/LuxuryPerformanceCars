package com.example.backend.Contoller;

import com.example.backend.Data.Dao.UtenteDao;
import com.example.backend.Data.Entities.Utente;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;

@Controller
public class LoginController {

    private final UtenteDao udao;

    // Iniezione di UtenteDao tramite il costruttore
    @Autowired
    public LoginController(UtenteDao udao) {
        this.udao = udao;
    }

    @PostMapping("/doLogin")
    protected String doLogin(HttpServletRequest req, HttpServletResponse resp, Model model) throws IOException {
        String email = req.getParameter("email");
        String password = req.getParameter("password");

        Utente utente = udao.findByEmail(email);
        boolean logged = false;
        HttpSession session = req.getSession();

        if (utente != null && password.equals(utente.getPassword())) {
            logged = true;
            session.setAttribute("utente", utente);
            session.setAttribute("sessionId", session.getId());
            req.getServletContext().setAttribute(session.getId(), session);
        }

        if (logged) {
            resp.sendRedirect("http://localhost:4200/home?sessionId=" + session.getId());
            return null;
        } else {
            String errorMessage = "Le credenziali fornite non sono valide";
            model.addAttribute("errorMessage", errorMessage);
            return "login";
        }
    }
}
