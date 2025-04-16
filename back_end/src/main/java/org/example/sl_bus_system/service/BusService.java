package org.example.sl_bus_system.service;

import org.example.sl_bus_system.dto.BusDTO;
import org.example.sl_bus_system.dto.BusLocationDTO;
import org.example.sl_bus_system.dto.BusReqDTO;
import java.util.List;

public interface BusService {
    void registerBus(BusReqDTO busReqDTO);
    List<BusDTO> getAllBus();
    boolean updateBus(BusLocationDTO busLocationDTO);
}
