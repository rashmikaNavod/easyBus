package org.example.sl_bus_system.controller;

import org.example.sl_bus_system.dto.AuthRequestDTO;
import org.example.sl_bus_system.dto.RegisterRequestDTO;
import org.example.sl_bus_system.dto.ResponseDTO;
import org.example.sl_bus_system.service.AuthService;
import org.example.sl_bus_system.util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody RegisterRequestDTO user) {
        return authService.userRegister(user);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody AuthRequestDTO request) {
        return authService.userLogin(request);
    }
}
