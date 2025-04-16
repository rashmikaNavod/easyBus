package org.example.sl_bus_system.controller;

import org.example.sl_bus_system.dto.BusLocationDTO;
import org.example.sl_bus_system.dto.ChatDTO;
import org.example.sl_bus_system.dto.UserBusDTO;
import org.example.sl_bus_system.service.BusService;
import org.example.sl_bus_system.service.ChatService;
import org.example.sl_bus_system.service.UserBusService;
import org.example.sl_bus_system.service.impl.UserBusServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ChatService chatService;
    @Autowired
    private BusService busService;
    @Autowired
    private UserBusServiceImpl userBusService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatDTO chatDTO) {
        ChatDTO saveChat = chatService.saveTextMessage(chatDTO);
        messagingTemplate.convertAndSend("/topic/bus/" + saveChat.getBusId(), saveChat);
        System.out.println(saveChat);;
    }

    @MessageMapping("/chat.sendLocationObj")
    public void sendLocationObj(@Payload BusLocationDTO busLocationDTO) {
        boolean isUpdate = busService.updateBus(busLocationDTO);
        if (isUpdate) {
            System.out.println(busLocationDTO);
            messagingTemplate.convertAndSend("/topic/location/" + busLocationDTO.getBusId(), busLocationDTO);
        }
    }

    @MessageMapping("/chat.joinBus")
    public void joinBus(@Payload UserBusDTO userBusDTO) {
        userBusService.addUserToBus(userBusDTO.getUsername(), userBusDTO.getBusId());
        // Notify others that user has joined
//        ChatDTO joinMessage = new ChatDTO();
//        joinMessage.setSender(userBusDTO.getUsername());
//        joinMessage.setContent(userBusDTO.getUsername() + " has joined the chat");
//        joinMessage.setBusId(userBusDTO.getBusId());
//        messagingTemplate.convertAndSend("/topic/bus/" + userBusDTO.getBusId(), joinMessage);
    }

    @MessageMapping("/chat.leaveBus")
    public void leaveBus(@Payload UserBusDTO userBusDTO) {
        userBusService.removeUserFromBus(userBusDTO.getUsername(), userBusDTO.getBusId());
        // Notify others that user has left
//        ChatDTO leaveMessage = new ChatDTO();
//        leaveMessage.setSender("System");
//        leaveMessage.setContent(userBusDTO.getUsername() + " has left the chat");
//        leaveMessage.setBusId(userBusDTO.getBusId());
//        messagingTemplate.convertAndSend("/topic/bus/" + userBusDTO.getBusId(), leaveMessage);
    }

}
