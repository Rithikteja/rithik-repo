package com.parking.smartparking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.parking.smartparking.model.User;
import com.parking.smartparking.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    public User saveUser(User user) {
        return repo.save(user);
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User getUserById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public User getUserByUsername(String username) {
        return repo.findByUsername(username);
    }

    public User getUserByEmail(String email) {
        return repo.findByEmail(email);
    }

    public User updateUser(Long id, User user) {
        User existing = repo.findById(id).orElse(null);
        if (existing != null) {
            existing.setUsername(user.getUsername());
            existing.setEmail(user.getEmail());
            existing.setPassword(user.getPassword());
            existing.setPhone(user.getPhone());
            existing.setVerified(user.getVerified());
            return repo.save(existing);
        }
        return null;
    }

    public void deleteUser(Long id) {
        repo.deleteById(id);
    }
}