package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service

public class LoginService {
    @Autowired
    private LoginRepository lr;

    public Optional<User> login(Map<String, String> credentials){
        Optional<User> useremail= lr.findByEmail(credentials.get("email"));

        if(useremail.isPresent() && useremail.get().getPassword().equals(credentials.get("password"))){
            return useremail;
        }
        return Optional.empty();
    }
}
