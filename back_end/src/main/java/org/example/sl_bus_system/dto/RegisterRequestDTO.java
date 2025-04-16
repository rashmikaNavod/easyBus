package org.example.sl_bus_system.dto;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class RegisterRequestDTO {
    private String fullName;
    private String username;
    private String email;
    private String password;
    private String role;
    private String phoneNumber;
    private String status;
}
