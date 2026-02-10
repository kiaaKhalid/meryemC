package com.meryem.maintenance.controller;

import com.meryem.maintenance.entity.User;
import com.meryem.maintenance.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.meryem.maintenance.dto.UpdateAccountRequest;
import com.meryem.maintenance.dto.UpdatePasswordRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        log.info("Creating user: {}, Password length: {}", user.getUsername(), (user.getPassword() != null ? user.getPassword().length() : "NULL"));
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        log.info("Updating user ID: {}, Password length: {}", id, (user.getPassword() != null ? user.getPassword().length() : "NULL"));
        user.setId(id);
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> updatePassword(@PathVariable Long id, @RequestBody UpdatePasswordRequest request) {
        boolean updated = userService.updatePassword(id, request.getCurrentPassword(), request.getNewPassword());
        if (updated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}/account")
    public ResponseEntity<User> updateAccount(@PathVariable Long id, @RequestBody UpdateAccountRequest request) {
        return userService.updateAccountDetails(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/image")
    public ResponseEntity<User> updateImage(@PathVariable Long id, @RequestBody com.meryem.maintenance.dto.UpdateImageRequest request) {
        log.info("Processing image update for user ID: {}", id);
        try {
            if (request.getImage() != null) {
                log.info("Image payload length: {}", request.getImage().length());
            } else {
                log.warn("Error: Image payload is null for user ID: {}", id);
            }
            
            return userService.updateProfileImage(id, request.getImage())
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("CRITICAL ERROR during profile image update for user ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
