package org.example.sl_bus_system.service.impl;


import org.example.sl_bus_system.dto.*;
import org.example.sl_bus_system.entity.*;
import org.example.sl_bus_system.enums.BusDetails;
import org.example.sl_bus_system.exception.ResourceAlreadyExistException;
import org.example.sl_bus_system.exception.ResourceNotFoundException;
import org.example.sl_bus_system.repo.BusRepository;
import org.example.sl_bus_system.repo.RouteRepository;
import org.example.sl_bus_system.repo.UserRepository;
import org.example.sl_bus_system.service.BusService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BusServiceImpl implements BusService {
    @Autowired
    private BusRepository busRepository;
    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public void registerBus(BusReqDTO busReqDTO) {

        if(busRepository.existsByBusNumber(busReqDTO.getBusNumber())){
            throw new ResourceAlreadyExistException("Bus number already exists");
        }

        Optional<Route> routeOptional = routeRepository.findById(busReqDTO.getRouteId());
        if(!routeOptional.isPresent()){
            throw new ResourceNotFoundException("Route not found");
        }

        Optional<User> userOptional = userRepository.findByUsername(busReqDTO.getUsername());
        if(!userOptional.isPresent()){
            throw new ResourceNotFoundException("User not found");
        }

        try{
            Bus bus = new Bus();
            bus.setBusNumber(busReqDTO.getBusNumber());
            bus.setBusType(busReqDTO.getBusType());
            bus.setDriverName(busReqDTO.getDriverName());
            bus.setPhoneNumber(busReqDTO.getPhoneNumber());
            bus.setSeats(busReqDTO.getSeats());
            bus.setStatus(BusDetails.ACTIVE.toString());
            bus.setStartOrOff(BusDetails.Parked.toString());
            bus.setRoute(routeOptional.get());
            bus.setUser(userOptional.get());

            Bus_Seat busSeat = new Bus_Seat();
            busSeat.setTopLeft(busReqDTO.getTopLeft());
            busSeat.setTopRight(busReqDTO.getTopRight());
            busSeat.setMiddleLeft(busReqDTO.getMiddleLeft());
            busSeat.setMiddleRight(busReqDTO.getMiddleRight());
            busSeat.setBottom(busReqDTO.getBottom());
            busSeat.setBus(bus);

            bus.setSeat(busSeat);

            if(busReqDTO.getSchedules() != null && !busReqDTO.getSchedules().isEmpty()){
                List<Schedule> scheduleList = new ArrayList<>();
                for(ScheduleDTO scheduleDTO : busReqDTO.getSchedules()){
                    Schedule schedule = new Schedule();
                    schedule.setStartTime(scheduleDTO.getStartTime());
                    schedule.setStartPlace(scheduleDTO.getStartPlace());
                    schedule.setEndTime(scheduleDTO.getEndTime());
                    schedule.setEndPlace(scheduleDTO.getEndPlace());
                    schedule.setBus(bus);
                    scheduleList.add(schedule);
                }
                bus.setSchedules(scheduleList);
            }

            if(busReqDTO.getPrices() != null && !busReqDTO.getPrices().isEmpty()){
                List<Price> pricesList = new ArrayList<>();
                for(PriceDTO priceDTO : busReqDTO.getPrices()){
                    Price price = new Price();
                    price.setPrice(priceDTO.getPrice());
                    price.setStartPlace(priceDTO.getStartPlace());
                    price.setEndPlace(priceDTO.getEndPlace());
                    price.setBus(bus);
                    pricesList.add(price);
                }
                bus.setPrices(pricesList);
            }

            busRepository.save(bus);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public List<BusDTO> getAllBus() {
        return modelMapper.map(busRepository.findAll(), new TypeToken<List<BusDTO>>(){}.getType());
    }

    @Override
    public boolean updateBus(BusLocationDTO busLocationDTO) {
        Optional<Bus>  busOptional= busRepository.findById(busLocationDTO.getBusId());
        if(!busOptional.isPresent()){
            throw new ResourceNotFoundException("Bus not found");
        }
        Bus bus = busOptional.get();
        bus.setLatitude(busLocationDTO.getLat());
        bus.setLongitude(busLocationDTO.getLng());
        busRepository.save(bus);
        return true;
    }
}
