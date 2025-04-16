package org.example.sl_bus_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Price {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer priceId;

    @Column(nullable = false)
    private String startPlace;

    @Column(nullable = false)
    private String endPlace;

    @Column(nullable = false)
    private Double price;

    @ManyToOne
    @JoinColumn(nullable = false, name = "busId", referencedColumnName = "busId")
    private Bus bus;
}
