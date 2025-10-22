package com.example.project.controller;

import com.example.project.model.User;

import com.example.project.service.loginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping({"/api/auth"})
@CrossOrigin(origins = "http://localhost:4200")
public class loginController {
    @Autowired
    final  private loginService loginService;

    public loginController(loginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping({"/login"})
    public ResponseEntity<Map<String, String>> login(@RequestBody User users) {
        boolean authenticated = this.loginService.authenticate(users.getEmail(), users.getPassword());
        Map<String, String> response = new HashMap();
        if (authenticated) {
            String role = this.loginService.getUserRoleByEmail(users.getEmail());
            response.put("message", "Login Successful");
            response.put("role", role);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid Credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
