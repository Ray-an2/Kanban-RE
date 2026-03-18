package com.kanban.notification.mappers;

import com.kanban.compte.entity.Compte;
import com.kanban.notification.dtos.NotificationDto;
import com.kanban.notification.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {
    public NotificationDto toDto(Notification notification) {
        if (notification == null){
            return null;
        }
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setTitre(notification.getTitre());
        dto.setDateCreation(notification.getDateCreation());
        dto.setLien(notification.getLien());
        dto.setEtat(notification.getEtat());
        if (notification.getCompte() != null) {
            dto.setCptId(notification.getCompte().getId());
        }
        return dto;
    }

    public Notification toEntity(NotificationDto dto) {
        if (dto == null) {
            return null;
        }
        Notification notif = new Notification();
        if (dto.getId() != null) {
            notif.setId(dto.getId());
        }
        notif.setTitre(dto.getTitre());
        notif.setLien(dto.getLien());
        notif.setDateCreation(dto.getDateCreation());
        notif.setEtat(dto.getEtat());
        if (dto.getCptId() != null && !dto.getCptId().isBlank()) {
            Compte compte = new Compte();
            compte.setId(dto.getCptId());
            notif.setCompte(compte);
        }
        return notif;
    }
}
