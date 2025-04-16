package org.example.sl_bus_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Bus_Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;
    @Column(nullable = false)
    private LocalDate date;
    @Column(nullable = false)
    private String seatCount;
    private String description;
    @ManyToOne
    @JoinColumn(name = "busId", nullable = false, referencedColumnName = "busId")
    private Bus bus;
}
