package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.sl_bus_system.enums.MessageType;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusLocationDTO {
    private String sender;
    private MessageType type;
    private Double lat;
    private Double lng;
    private Integer busId;
}
