package org.example.sl_bus_system.service.impl;

import org.example.sl_bus_system.dto.*;
import org.example.sl_bus_system.entity.PasswordResetToken;
import org.example.sl_bus_system.entity.User;
import org.example.sl_bus_system.enums.UserStatus;
import org.example.sl_bus_system.exception.ResourceAlreadyExistException;
import org.example.sl_bus_system.exception.ResourceNotFoundException;
import org.example.sl_bus_system.repo.PasswordResetTokenRepository;
import org.example.sl_bus_system.repo.UserRepository;
import org.example.sl_bus_system.service.AuthService;
import org.example.sl_bus_system.service.UserService;
import org.example.sl_bus_system.util.JwtUtil;
import org.example.sl_bus_system.util.VarList;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired
    private JavaMailSender mailSender;

    private final long EXPIRATION_TIME_MINUTES = 5;

    @Override
    public ResponseEntity<ResponseDTO> userRegister(RegisterRequestDTO registerRequestDTO) {

        Optional<User> optionUser = userRepository.findByUsername(registerRequestDTO.getUsername());
        if(optionUser.isPresent()) {
            throw new ResourceAlreadyExistException("Username already exists");
        }

        if(userRepository.findByEmail(registerRequestDTO.getEmail()) != null){
            throw new ResourceAlreadyExistException("Email already exists");
        }

        try{
            Map<String,String> resToken = new HashMap<>();
            registerRequestDTO.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
            registerRequestDTO.setStatus(UserStatus.ACTIVE.toString());
            userRepository.save(modelMapper.map(registerRequestDTO, User.class));
            String token = jwtUtil.generateToken(registerRequestDTO.getEmail(), registerRequestDTO.getRole());
            resToken.put("token", token);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseDTO(VarList.Created,"User register successfully",resToken));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public ResponseEntity<ResponseDTO> userLogin(AuthRequestDTO authRequestDTO) {
        User user = userRepository.findByEmail(authRequestDTO.getEmail());
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }
        if (!passwordEncoder.matches(authRequestDTO.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Bad credentials");
        }
        if (user.getStatus().equals(UserStatus.INACTIVE.toString())) {
            throw new ResourceNotFoundException("Account is not active");
        }

        try{
            String token = jwtUtil.generateToken(authRequestDTO.getEmail(), user.getRole());
            Map<String,String> resToken = new HashMap<>();
            resToken.put("token", token);
            resToken.put("role", user.getRole());
            resToken.put("username", user.getUsername());
            resToken.put("email", user.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseDTO(VarList.Created,"User login successfully",resToken));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public UserDTO emailExists(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("Email Not Found");
        }

        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findPasswordResetTokenByUser(user);
        if (passwordResetToken != null) {
            passwordResetTokenRepository.delete(passwordResetToken);
            passwordResetTokenRepository.flush();
        }

        String otpCode = generateSixDigitOTP();

        PasswordResetToken myToken = new PasswordResetToken();
        myToken.setToken(otpCode);
        myToken.setUser(user);
        myToken.setExpiryDate(Instant.now().plus(EXPIRATION_TIME_MINUTES, ChronoUnit.MINUTES));
        passwordResetTokenRepository.save(myToken);

        sendPasswordResetEmail(user, otpCode);

        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(user.getUserId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setStatus(user.getStatus());
        // Don't include password in DTO
        return userDTO;
    }

    private void sendPasswordResetEmail(User user ,String otpCode) {
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setSubject("EasyBus Password Reset OTP");
            message.setTo(user.getEmail());
            message.setText("Your password reset code is: " + otpCode + "\n\nThis code will expire in 5 minutes.");
            message.setFrom("easybus.lk@gmail.com");

            System.out.println(message);

            mailSender.send(message);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    private String generateSixDigitOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);

        System.out.println(otp);

        return String.valueOf(otp);
    }

    @Override
    public boolean verifyOTP(String otpCode, String email) {
        User user  = userRepository.findByEmail(email);
        if(user == null) {
            return false;
        }
        PasswordResetToken token = passwordResetTokenRepository.findPasswordResetTokenByUser(user);
        if(token == null) {
            return false;
        }

        boolean isValid = token.getToken().equals(otpCode) && token.getExpiryDate().isAfter(Instant.now());
        return isValid;

    }

    @Override
    public ResponseEntity<ResponseDTO> resetPassword(ResetPasswordDTO resetPasswordDTO) {
        if (!verifyOTP(resetPasswordDTO.getOtp(), resetPasswordDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO(VarList.Bad_Gateway, "Invalid or expired OTP", null));
        }
        User user = userRepository.findByEmail(resetPasswordDTO.getEmail());
        user.setPassword(passwordEncoder.encode(resetPasswordDTO.getPassword()));
        userRepository.save(user);

        // Delete the used token
        PasswordResetToken token = passwordResetTokenRepository.findPasswordResetTokenByUser(user);
        if (token != null) {
            passwordResetTokenRepository.delete(token);
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseDTO(VarList.OK, "Password reset successfully", null));


    }
}
