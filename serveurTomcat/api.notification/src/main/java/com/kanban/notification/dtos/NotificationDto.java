package com.kanban.notification.dtos;

import lombok.Data;

@Data
public class NotificationDto {
    private String id;
    private String titre;
    private String dateCreation;
    private String lien;
    private String etat;
    private String cptId;
}
