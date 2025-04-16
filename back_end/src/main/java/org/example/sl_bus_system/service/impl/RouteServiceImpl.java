package org.example.sl_bus_system.service.impl;

import org.example.sl_bus_system.dto.RouteDTO;
import org.example.sl_bus_system.entity.Route;
import org.example.sl_bus_system.exception.ResourceNotFoundException;
import org.example.sl_bus_system.repo.RouteRepository;
import org.example.sl_bus_system.service.RouteService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteServiceImpl implements RouteService {
    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<RouteDTO> getAllRoutes() {
        try {
            List<RouteDTO> routeDTOList =  modelMapper
                    .map(routeRepository.findAll(), new TypeToken<List<RouteDTO>>() {}.getType());
            if(!routeDTOList.isEmpty()) {
                return routeDTOList;
            }else {
                throw new ResourceNotFoundException("Routes not found");
            }
        }catch (ResourceNotFoundException e){
            throw e;
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @Override
    public void createRoute(RouteDTO routeDTO) {
        try{
            routeRepository.save(modelMapper.map(routeDTO, Route.class));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateRoute(RouteDTO routeDTO) {
        try{
            routeRepository.save(modelMapper.map(routeDTO, Route.class));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
