package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {
    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String password;
    private String role;
    private String status;
}
