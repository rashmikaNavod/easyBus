package org.example.sl_bus_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.sl_bus_system.enums.MessageType;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatId;

    @Column(nullable = false)
    private String sender;

    @Enumerated(EnumType.STRING)
    private MessageType type;

    @Column(nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "busId", referencedColumnName = "busId", nullable = false)
    private Bus bus;

    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        timestamp = LocalDateTime.now();
    }

}
