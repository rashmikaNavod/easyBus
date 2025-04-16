package org.example.sl_bus_system.controller;

import org.example.sl_bus_system.dto.AuthRequestDTO;
import org.example.sl_bus_system.dto.MailDTO;
import org.example.sl_bus_system.dto.RegisterRequestDTO;
import org.example.sl_bus_system.dto.ResponseDTO;
import org.example.sl_bus_system.service.AuthService;
import org.example.sl_bus_system.util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody RegisterRequestDTO user) {
        return authService.userRegister(user);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody AuthRequestDTO request) {
        return authService.userLogin(request);
    }

    @PostMapping("/mail")
    public String sendEmail(@RequestBody MailDTO mailDTO){
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setSubject(mailDTO.getSubject());
            message.setTo(mailDTO.getToMail());
            message.setText(mailDTO.getMessage());
            message.setFrom("easybus.lk@gmail.com");
            mailSender.send(message);
            return "success";
        }catch (Exception e){
            e.printStackTrace();
            return e.getMessage();
        }

    }

}
