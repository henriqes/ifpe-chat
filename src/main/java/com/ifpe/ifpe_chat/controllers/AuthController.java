package com.ifpe.ifpe_chat.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ifpe.ifpe_chat.dto.LoginDTO;
import com.ifpe.ifpe_chat.dto.RegisterDTO;
import com.ifpe.ifpe_chat.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO dto) {

        return authService.register(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO dto) {

        return authService.login(dto);
    }

}
