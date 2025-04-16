package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScheduleDTO {
    private Integer scheduleId;
    private String startPlace;
    private LocalTime startTime;
    private String endPlace;
    private LocalTime endTime;
    private Integer busId;
}
