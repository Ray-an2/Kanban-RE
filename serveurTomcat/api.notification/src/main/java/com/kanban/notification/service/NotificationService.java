package com.kanban.notification.service;

import com.kanban.notification.dtos.NotificationDto;

import java.util.List;

public interface NotificationService {
    List<NotificationDto> getAll();
    List<NotificationDto> getByCompte(String compteId);
    List<NotificationDto> getByCompteAndEtat(String compteId, String etat);
    NotificationDto getById(String id);
    NotificationDto create(NotificationDto notificationDto);
    NotificationDto update(String id, NotificationDto notificationDto);
    NotificationDto markAsRead(String id);
    boolean delete(String id);
}
