package com.example.project.Repository;

import com.example.project.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface loginRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}