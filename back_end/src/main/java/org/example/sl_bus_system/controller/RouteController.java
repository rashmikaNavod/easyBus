package org.example.sl_bus_system.controller;

import org.example.sl_bus_system.dto.ResponseDTO;
import org.example.sl_bus_system.dto.RouteDTO;
import org.example.sl_bus_system.service.RouteService;
import org.example.sl_bus_system.util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/route")
public class RouteController {
    @Autowired
    private RouteService routeService;

    @PostMapping(path = "create")
    public ResponseEntity<ResponseDTO> createRoute(@RequestBody RouteDTO routeDTO) {
        routeService.createRoute(routeDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseDTO(VarList.Created,"Route created successfully",routeDTO));
    }

    @GetMapping(path = "getAll")
    public ResponseEntity<ResponseDTO> getAllRoutes() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseDTO(VarList.OK,"Route list retrieved",routeService.getAllRoutes()));
    }

    @PutMapping(path = "update")
    public ResponseEntity<ResponseDTO> updateRoute(@RequestBody RouteDTO routeDTO) {
        routeService.updateRoute(routeDTO);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(new ResponseDTO(VarList.Accepted,"Route update successfully",routeDTO));
    }


}
