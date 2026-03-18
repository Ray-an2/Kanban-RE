package com.kanban.notification.controller;

import com.kanban.notification.dtos.NotificationDto;
import com.kanban.notification.service.NotificationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationDto> getNotifications(
            @RequestParam(required = false) String cptId,
            @RequestParam(required = false) String etat
    ) {
        if (cptId != null && !cptId.isBlank() && etat != null && !etat.isBlank()) {
            return notificationService.getByCompteAndEtat(cptId, etat);
        }
        if (cptId != null && !cptId.isBlank()) {
            return notificationService.getByCompte(cptId);
        }
        return notificationService.getAll();
    }

    @GetMapping("/{notId}")
    public NotificationDto getNotificationById(@PathVariable String notId) {
        return notificationService.getById(notId);
    }

    @PostMapping
    public NotificationDto createNotification(@RequestBody NotificationDto notificationDto) {
        return notificationService.create(notificationDto);
    }

    @PutMapping("/{notId}")
    public NotificationDto updateNotification(@PathVariable String notId, @RequestBody NotificationDto notificationDto) {
        return notificationService.update(notId, notificationDto);
    }

    @PatchMapping("/{notId}/read")
    public NotificationDto markAsRead(@PathVariable String notId) {
        return notificationService.markAsRead(notId);
    }

    @DeleteMapping("/{notId}")
    public boolean deleteNotification(@PathVariable String notId) {
        return notificationService.delete(notId);
    }
}
