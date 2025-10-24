package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SignupService {
    @Autowired
    private LoginRepository loginRepository;

    private final BCryptPasswordEncoder passwordEncoder=new BCryptPasswordEncoder();
    public String signup(User user) {
        Optional<User> existingUser=loginRepository.findByEmail(user.getEmail());
        if(existingUser.isPresent()){
            return "exists";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("customer");
        user.setActive(true);
        loginRepository.save(user);
        return "success";
    }
}
