package org.example.sl_bus_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer busId;

    @Column(unique = true, nullable = false)
    private String busNumber;

    @Column(nullable = false)
    private String busType;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String driverName;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private Integer seats;

    private String startOrOff;

    private String status;

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL)
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Chat> chats;

    @OneToOne( mappedBy = "bus", cascade = CascadeType.ALL)
    private Bus_Seat seat;

    @ManyToOne
    @JoinColumn(name = "routeId", referencedColumnName = "routeId")
    private Route route;

    @ManyToOne
    @JoinColumn(nullable = false, name = "userId", referencedColumnName = "userId")
    private User user;

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL)
    private List<Bus_Book> books;

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL)
    private List<Price> prices;

}
