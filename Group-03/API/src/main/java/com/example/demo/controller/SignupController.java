package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.SignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class SignupController {
    @Autowired
    private SignupService signupService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user){
        String res= signupService.signup(user);
        return switch (res) {
            case "exists" -> ResponseEntity.badRequest().body(Map.of("message","Account already exists with this email."));
            case "success" -> ResponseEntity.ok(Map.of("message","Account created successfully"));
            default -> ResponseEntity.status(500).body(Map.of("message","Something went wrong"));
        };
    }
}
