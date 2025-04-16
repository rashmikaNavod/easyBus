package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserBusDTO {
    private String username;
    private Integer busId;
}
