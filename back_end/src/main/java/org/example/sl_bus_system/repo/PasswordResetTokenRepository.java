package org.example.sl_bus_system.repo;

import org.example.sl_bus_system.dto.PasswordResetTokenDTO;
import org.example.sl_bus_system.entity.PasswordResetToken;
import org.example.sl_bus_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetTokenDTO findByToken(String token);
    PasswordResetToken findByUser(User user);
}
