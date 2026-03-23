package com.parking.smartparking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.parking.smartparking.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
}