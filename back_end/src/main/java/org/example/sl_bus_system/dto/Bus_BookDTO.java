package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Bus_BookDTO {
    private Long bookId;
    private LocalDate date;
    private String seatCount;
    private String description;
    private Integer busId;
}
