package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusReqDTO {
    //Bus related fields
    private String busNumber;
    private String busType;
    private String phoneNumber;
    private String driverName;
    private Integer seats;
    private Integer routeId;
    private String username;
    // Bus_Seat related fields
    private String topLeft;
    private String topRight;
    private String middleLeft;
    private String middleRight;
    private String bottom;
    // Schedule related fields
    private List<ScheduleDTO> schedules;
    // price related fields
    private  List<PriceDTO> prices;
}
