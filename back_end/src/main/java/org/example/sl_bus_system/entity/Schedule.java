package org.example.sl_bus_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer scheduleId;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private String startPlace;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String endPlace;

    @ManyToOne
    @JoinColumn(name = "busId", nullable = false, referencedColumnName = "busId")
    private Bus bus;
}
