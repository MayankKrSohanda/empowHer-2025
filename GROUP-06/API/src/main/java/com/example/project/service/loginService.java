package com.example.project.service;

import com.example.project.Repository.loginRepository;
import com.example.project.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class loginService {
    @Autowired
    private loginRepository loginRepository;

    public boolean authenticate(String email, String password) {
        User users = this.loginRepository.findByEmail(email);
        return users != null && users.getPassword().equals(password);
    }

    public String getUserRoleByEmail(String email) {
        User users = this.loginRepository.findByEmail(email);
        if (users != null) return users.getRole();
        return "users";
    }
}
