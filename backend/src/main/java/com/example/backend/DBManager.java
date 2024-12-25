package com.example.backend;

import com.example.backend.Data.Dao.AutoDao;
import com.example.backend.Data.Dao.UtenteDao;
import com.example.backend.Data.Dao.WishlistDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Configuration
public class DBManager {

    private static DBManager instance = null;

    private Connection conn = null;

    @Autowired
    private AutoDao autoDao;

    @Autowired
    private UtenteDao utenteDao;

    @Autowired
    private WishlistDao wishlistDao;

    // Costruttore pubblico
    public DBManager() {
    }

    public static DBManager getInstance() {
        if (instance == null) {
            instance = new DBManager();
        }
        return instance;
    }

    public Connection getConnection() {
        if (conn == null) {
            try {
                conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/postgres", "postgres", "1234");
                System.out.println("Connection established");
            } catch (SQLException e) {
                System.out.println("Connection error: " + e.getMessage());
            }
        }
        return conn;
    }

    public AutoDao getAutoDao() {
        return autoDao;
    }

    public UtenteDao getUtenteDao() {
        return utenteDao;
    }

    public WishlistDao getWishlistDao() {
        return wishlistDao;
    }
}
