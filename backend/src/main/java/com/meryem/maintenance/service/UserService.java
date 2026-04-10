package com.meryem.maintenance.service;

import com.meryem.maintenance.entity.User;
import com.meryem.maintenance.entity.Compte;
import com.meryem.maintenance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User saveUser(User user) {
        // Ensure bidirectional relationship for Compte
        if (user.getCompte() != null) {
            user.getCompte().setUser(user);
        }
        
        // Enforce Roles: ADMIN or VISITOR
        if (user.getRole() == null || (!user.getRole().equals("ADMIN") && !user.getRole().equals("VISITOR"))) {
            user.setRole("VISITOR");
        }
        
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> authenticate(String email, String password) {
        System.out.println("Attempting login for email: " + email);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            System.out.println("User found! DB Password: '" + user.getPassword() + "', Input Password: '" + password + "'");
            if (user.getPassword() != null && user.getPassword().equals(password)) {
                 System.out.println("Password match!");
                 return Optional.of(user);
            } else {
                 System.out.println("Password mismatch.");
            }
        } else {
            System.out.println("User not found for email.");
        }
        return Optional.empty();
    }

    @Transactional
    public boolean updatePassword(Long id, String oldPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword() != null && user.getPassword().equals(oldPassword)) {
                user.setPassword(newPassword);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    @Transactional
    public Optional<User> updateAccountDetails(Long id, com.meryem.maintenance.dto.UpdateAccountRequest request) {
        return userRepository.findById(id).map(user -> {
            if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
                user.setUsername(request.getUsername());
            }
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
                user.setEmail(request.getEmail());
            }
            if (request.getCivility() != null) {
                user.setCivility(request.getCivility());
            }
            return userRepository.save(user);
        });
    }

    @Transactional
    public Optional<User> updateProfileImage(Long id, String imageBase64) {
        return userRepository.findById(id).map(user -> {
            user.setProfileImage(imageBase64);
            return userRepository.save(user);
        });
    }
}
