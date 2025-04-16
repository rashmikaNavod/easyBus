package org.example.sl_bus_system.repo;

import org.example.sl_bus_system.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends JpaRepository<Route, Integer> {
}
