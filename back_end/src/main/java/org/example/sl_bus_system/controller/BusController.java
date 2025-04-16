package org.example.sl_bus_system.controller;

import org.example.sl_bus_system.dto.BusReqDTO;
import org.example.sl_bus_system.dto.ResponseDTO;
import org.example.sl_bus_system.service.BusService;
import org.example.sl_bus_system.util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bus")
public class BusController {
    @Autowired
    private BusService busService;

    @PostMapping(path = "register")
    public ResponseEntity<ResponseDTO> addBus(@RequestBody BusReqDTO busReqDTO) {
        busService.registerBus(busReqDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseDTO(VarList.Created,"Bus register successfully",null));
    }

    @GetMapping(path = "getAll")
    public ResponseEntity<ResponseDTO> getAllBus() {
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(new ResponseDTO(VarList.Created,"all get",busService.getAllBus()));
    }

}
