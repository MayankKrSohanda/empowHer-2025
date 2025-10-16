package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.LoginRepository;
import com.example.demo.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(
        origins = "http://localhost:4200",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/api")
public class LoginController {
    @Autowired
    private LoginService ls;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        Optional<User> result = ls.login(credentials);
        if (result.isPresent()) {
            User user = result.get();
            Map<String, Object> response = Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "name", user.getName()
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

}
