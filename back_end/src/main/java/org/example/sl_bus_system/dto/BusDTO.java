package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusDTO {
    private Integer busId;
    private String busNumber;
    private String busType;
    private String phoneNumber;
    private String driverName;
    private Integer seats;
    private Double latitude;
    private Double longitude;
    private String startOrOff;
    private String status;
    private List<ScheduleDTO> schedules;
    private Integer seatId;
    private Integer routeId;
    private Long userId;
//    private List<ChatDTO> chats;
    private List<PriceDTO> prices;
    private List<Bus_BookDTO> books;
}
