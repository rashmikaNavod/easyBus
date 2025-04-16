package org.example.sl_bus_system.controller;

import org.example.sl_bus_system.dto.*;
import org.example.sl_bus_system.service.AuthService;
import org.example.sl_bus_system.service.UserService;
import org.example.sl_bus_system.util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


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

    @GetMapping("/check_mail/{mail}")
    public ResponseEntity<ResponseDTO> checkMail(@PathVariable("mail") String mail) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseDTO(VarList.OK, "Email found and OTP send",authService.emailExists(mail)));
    }

    @PostMapping("/verify_otp")
    public ResponseEntity<ResponseDTO> verifyOTP(@RequestParam String otp, @RequestParam String email) {
        boolean isValid = authService.verifyOTP(otp, email);
        if (isValid) {
            Map<String, Object> data = new HashMap<>();
            data.put("verified", true);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseDTO(VarList.OK, "OTP verified successfully", data));
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("verified", false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO(VarList.Bad_Gateway, "Invalid or expired OTP", data));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseDTO> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        return authService.resetPassword(resetPasswordDTO);
    }

}
