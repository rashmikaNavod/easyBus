package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PriceDTO {
    private Integer priceId;
    private String startPlace;
    private String endPlace;
    private Double price;
    private Integer busId;
}
