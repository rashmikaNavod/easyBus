package org.example.sl_bus_system.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthRequestDTO {
    private String email;
    private String password;
}
