package com.kanban.notification.repository;

import com.kanban.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByCompteId(String compteId);
    List<Notification> findByCompteIdAndEtat(String compteId, String etat);
}
