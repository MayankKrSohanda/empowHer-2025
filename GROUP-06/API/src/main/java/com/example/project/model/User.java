package com.example.project.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "users",
        schema = "empowher_db"
)

public class User {

        @Id
        @GeneratedValue(
                strategy = GenerationType.IDENTITY
        )
        @Column(
                name = "user_id"
        )
        private Long userId;
        private String name;
        private String email;
        private String password;
        private String role;
        @Column(
                name = "is_active"
        )
        private Boolean isActive;
        @Column(
                name = "create_at"
        )
        private LocalDateTime createAt;
        @Column(
                name = "update_at"
        )
        private LocalDateTime updateAt;

        public Long getUserId() {
            return this.userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getName() {
            return this.name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return this.email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return this.password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return this.role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public Boolean getActive() {
            return this.isActive;
        }

        public void setActive(Boolean active) {
            this.isActive = active;
        }

        public LocalDateTime getCreateAt() {
            return this.createAt;
        }

        public void setCreateAt(LocalDateTime createAt) {
            this.createAt = createAt;
        }

        public LocalDateTime getUpdateAt() {
            return this.updateAt;
        }

        public void setUpdateAt(LocalDateTime updateAt) {
            this.updateAt = updateAt;
        }
    }


