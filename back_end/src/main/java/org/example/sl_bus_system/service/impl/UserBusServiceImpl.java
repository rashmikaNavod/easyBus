package org.example.sl_bus_system.service.impl;
import org.example.sl_bus_system.service.UserBusService;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Service
public class UserBusServiceImpl implements UserBusService {
    // Map to store which users are on which buses
    private final Map<Integer, Set<String>> busUsers = new ConcurrentHashMap<>();

    // Map to store which bus each user is on
    private final Map<String, Integer> userCurrentBus = new ConcurrentHashMap<>();

    public void addUserToBus(String username, Integer busId) {
        // Remove user from previous bus if any
        Integer previousBusId = userCurrentBus.get(username);
        if (previousBusId != null) {
            Set<String> users = busUsers.get(previousBusId);
            if (users != null) {
                users.remove(username);
            }
        }

        // Add user to new bus
        busUsers.computeIfAbsent(busId, k -> new CopyOnWriteArraySet<>()).add(username);
        userCurrentBus.put(username, busId);
    }

    public void removeUserFromBus(String username, Integer busId) {
        Set<String> users = busUsers.get(busId);
        if (users != null) {
            users.remove(username);
        }
        userCurrentBus.remove(username);
    }

    public Set<String> getUsersOnBus(Integer busId) {
        return busUsers.getOrDefault(busId, new CopyOnWriteArraySet<>());
    }

    public boolean isUserOnBus(String username, Integer busId) {
        Set<String> users = busUsers.get(busId);
        return users != null && users.contains(username);
    }
}