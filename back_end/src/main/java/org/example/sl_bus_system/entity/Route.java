package org.example.sl_bus_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer routeId;

    @Column(nullable = false)
    private Integer routeNumber;

    @Column(nullable = false)
    private String startPlace;

    @Column(nullable = false)
    private String endPlace;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<Bus> buses;

}
