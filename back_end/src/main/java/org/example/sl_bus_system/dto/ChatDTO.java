package org.example.sl_bus_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.sl_bus_system.enums.MessageType;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatDTO {
    private Long chatId;
    private String sender;
    private MessageType type;
    private String content;
    private Integer busId;
    private LocalDateTime timestamp;
}
