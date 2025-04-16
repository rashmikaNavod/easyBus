package org.example.sl_bus_system.service;

import org.example.sl_bus_system.dto.AuthRequestDTO;
import org.example.sl_bus_system.dto.RegisterRequestDTO;
import org.example.sl_bus_system.dto.ResponseDTO;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<ResponseDTO> userRegister(RegisterRequestDTO registerRequestDTO);
    ResponseEntity<ResponseDTO> userLogin(AuthRequestDTO authRequestDTO);
}
