package org.example.sl_bus_system.repo;

import org.example.sl_bus_system.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusRepository extends JpaRepository<Bus, Integer> {
    boolean existsByBusNumber(String busNumber);
}
