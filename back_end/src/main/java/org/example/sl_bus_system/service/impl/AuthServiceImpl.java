package org.example.sl_bus_system.service.impl;

import org.example.sl_bus_system.dto.AuthRequestDTO;
import org.example.sl_bus_system.dto.RegisterRequestDTO;
import org.example.sl_bus_system.dto.ResponseDTO;
import org.example.sl_bus_system.entity.User;
import org.example.sl_bus_system.enums.UserStatus;
import org.example.sl_bus_system.exception.ResourceAlreadyExistException;
import org.example.sl_bus_system.exception.ResourceNotFoundException;
import org.example.sl_bus_system.repo.UserRepository;
import org.example.sl_bus_system.service.AuthService;
import org.example.sl_bus_system.service.UserService;
import org.example.sl_bus_system.util.JwtUtil;
import org.example.sl_bus_system.util.VarList;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
}
