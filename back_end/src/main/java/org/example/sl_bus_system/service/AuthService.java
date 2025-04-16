package org.example.sl_bus_system.service;

import org.example.sl_bus_system.dto.*;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<ResponseDTO> userRegister(RegisterRequestDTO registerRequestDTO);
    ResponseEntity<ResponseDTO> userLogin(AuthRequestDTO authRequestDTO);
    UserDTO emailExists(String email);
    boolean verifyOTP(String otpCode, String email);
    ResponseEntity<ResponseDTO> resetPassword(ResetPasswordDTO resetPasswordDTO);
}
