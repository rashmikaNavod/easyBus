package org.example.sl_bus_system.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PasswordResetTokenDTO {
    private Long resetTokenId;
    private String token;
    private Instant expiryDate;
    private UserDTO user;
}
