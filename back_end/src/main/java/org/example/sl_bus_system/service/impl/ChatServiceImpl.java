package org.example.sl_bus_system.service.impl;

import org.example.sl_bus_system.dto.ChatDTO;
import org.example.sl_bus_system.entity.Bus;
import org.example.sl_bus_system.entity.Chat;
import org.example.sl_bus_system.enums.MessageType;
import org.example.sl_bus_system.exception.ResourceNotFoundException;
import org.example.sl_bus_system.repo.BusRepository;
import org.example.sl_bus_system.repo.ChatRepository;
import org.example.sl_bus_system.service.ChatService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {
    @Autowired
    private BusRepository busRepository;
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ChatDTO saveTextMessage(ChatDTO chatDTO) {

        Optional<Bus> bus = busRepository.findById(chatDTO.getBusId());
        if (!bus.isPresent()) {
            throw new ResourceNotFoundException("Bus not found");
        }

        try {
            Chat chat = new Chat();
            chat.setSender(chatDTO.getSender());
            chat.setContent(chatDTO.getContent());
            chat.setType(MessageType.TEXT);
            chat.setBus(bus.get());
            Chat savedChat = chatRepository.save(chat);
            return modelMapper.map(savedChat, ChatDTO.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}
