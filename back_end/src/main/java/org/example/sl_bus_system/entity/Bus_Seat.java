package org.example.sl_bus_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Bus_Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer seatId;

    @Column(nullable = false)
    private String topLeft;

    @Column(nullable = false)
    private String topRight;

    @Column(nullable = false)
    private String middleLeft;

    @Column(nullable = false)
    private String middleRight;

    @Column(nullable = false)
    private String bottom;

    @OneToOne
    @JoinColumn(name = "busId", referencedColumnName = "busId", nullable = false)
    private Bus bus;

}
