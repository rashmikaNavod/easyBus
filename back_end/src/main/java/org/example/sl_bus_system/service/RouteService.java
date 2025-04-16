package org.example.sl_bus_system.service;

import org.example.sl_bus_system.dto.RouteDTO;

import java.util.List;

public interface RouteService {
    void updateRoute(RouteDTO routeDTO);
    void createRoute(RouteDTO routeDTO);
    List<RouteDTO> getAllRoutes();
}
