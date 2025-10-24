package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Optional<User> validateUser(String email, String password) {
        Optional<User> optionalUser = loginRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if(passwordEncoder.matches(password,user.getPassword())){
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
}


