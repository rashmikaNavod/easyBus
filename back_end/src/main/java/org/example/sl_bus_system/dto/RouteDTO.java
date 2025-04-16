package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RouteDTO {
    private Integer routeId;
    private Integer routeNumber;
    private String startPlace;
    private String endPlace;
    private List<BusDTO> buses;
}
