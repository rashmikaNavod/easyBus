package org.example.sl_bus_system.service;

import org.example.sl_bus_system.dto.ChatDTO;

public interface ChatService {
    ChatDTO saveTextMessage(ChatDTO chat);
}
