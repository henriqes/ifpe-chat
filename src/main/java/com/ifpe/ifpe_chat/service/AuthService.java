package com.ifpe.ifpe_chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ifpe.ifpe_chat.dto.LoginDTO;
import com.ifpe.ifpe_chat.dto.RegisterDTO;
import com.ifpe.ifpe_chat.model.entities.User;
import com.ifpe.ifpe_chat.model.repositories.UserRepository;
import com.ifpe.ifpe_chat.security.JwtUtils;

@Service
public class AuthService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<String> register(RegisterDTO dto) {

        if (repository.existsByUsername(dto.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Nome de usuário já está em uso.");
        }

        if (repository.existsByEmail(dto.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("E-mail já está em uso.");
        }

        User user = new User();

        user.setUsername(dto.getUsername());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user.setRole("USER");

        repository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Usuário cadastrado com sucesso.");
    }

    public ResponseEntity<String> login(LoginDTO dto) {

        User user = repository
                .findByUsername(dto.getUsername())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Usuário ou senha inválidos.");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Usuário ou senha inválidos.");
        }

        String token = JwtUtils.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity.ok(token);
    }
}
