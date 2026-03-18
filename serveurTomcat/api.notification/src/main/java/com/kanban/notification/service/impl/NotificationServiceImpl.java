package com.kanban.notification.service.impl;

import com.kanban.compte.repository.CompteRepository;
import com.kanban.notification.dtos.NotificationDto;
import com.kanban.notification.entity.Notification;
import com.kanban.notification.mappers.NotificationMapper;
import com.kanban.notification.repository.NotificationRepository;
import com.kanban.notification.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service("notificationService")
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final CompteRepository compteRepository;
    private final NotificationMapper notificationMapper;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            CompteRepository compteRepository,
            NotificationMapper notificationMapper
    ) {
        this.notificationRepository = notificationRepository;
        this.compteRepository = compteRepository;
        this.notificationMapper = notificationMapper;
    }

    /**
     * Liste tous les notifications présente dans le systeme
     * @return Une liste de notifications
     */
    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getAll() {
        return notificationRepository.findAll().stream().map(notificationMapper::toDto).toList();
    }

    /**
     * Retourne tous les notifications d'un compte en particulier
     * @param compteId : identifiant du compte
     * @return Une liste de notifications
     */
    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getByCompte(String compteId) {
        return notificationRepository.findByCompteId(compteId).stream().map(notificationMapper::toDto).toList();
    }

    /**
     * Retourne une liste de notifications d'un compte et d'un etat particulier.
     * @param compteId : identifiant d'un compte
     * @param etat : etat de la notification (L : lu, N : non lu), l'etat est contrôler avec la méthode normalizeEtat.
     * @return Une liste de notifications
     */
    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getByCompteAndEtat(String compteId, String etat) {
        return notificationRepository.findByCompteIdAndEtat(compteId, normalizeEtat(etat))
                .stream()
                .map(notificationMapper::toDto)
                .toList();
    }

    /**
     * Récupère une notification en particulier.
     * @param id : identifiant de la notification.
     * @return Une Notification.
     */
    @Override
    @Transactional(readOnly = true)
    public NotificationDto getById(String id) {
        return notificationRepository.findById(id)
                .map(notificationMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Aucune notification trouvée avec l'id " + id));
    }

    /**
     * Créer une notification.
     * @param notificationDto
     * @return
     */
    @Override
    public NotificationDto create(NotificationDto notificationDto) {
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setTitre(notificationDto.getTitre());
        notification.setLien(notificationDto.getLien());
        notification.setDateCreation(Instant.now().toString());
        notification.setEtat("N");
        notification.setCompte(compteRepository.findById(notificationDto.getCptId())
                .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + notificationDto.getCptId())));
        return notificationMapper.toDto(notificationRepository.save(notification));
    }

    /**
     * Met à jour une notification en particulier
     * @param id : identifiant de la notification
     * @param notificationDto
     * @return
     */
    @Override
    public NotificationDto update(String id, NotificationDto notificationDto) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aucune notification trouvée avec l'id " + id));
        existing.setTitre(notificationDto.getTitre());
        existing.setLien(notificationDto.getLien());
        existing.setEtat(normalizeEtat(notificationDto.getEtat()));
        if (notificationDto.getCptId() != null && !notificationDto.getCptId().isBlank()) {
            existing.setCompte(compteRepository.findById(notificationDto.getCptId())
                    .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec l'id " + notificationDto.getCptId())));
        }
        return notificationMapper.toDto(notificationRepository.save(existing));
    }

    /**
     * Transforme l'etat de la notification en lu (L).
     * @param id : identifiant de la notification
     * @return
     */
    @Override
    public NotificationDto markAsRead(String id) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aucune notification trouvée avec l'id " + id));
        existing.setEtat("L");
        return notificationMapper.toDto(notificationRepository.save(existing));
    }

    /**
     * Supprime une notification en particulier
     * @param id : identifiant de la notification
     * @return true si supprimé, sinon false
     */
    @Override
    public boolean delete(String id) {
        if (!notificationRepository.existsById(id)) {
            return false;
        }
        notificationRepository.deleteById(id);
        return true;
    }

    /**
     * Vérifie que l'etat passé en paramètre est conforme.
     * @param etat : etat passé en paramètre
     * @return N par défaut si l'etat est null ou vide, sinon L ou N.
     */
    private String normalizeEtat(String etat) {
        if (etat == null || etat.isBlank()) {
            return "N";
        }
        String normalized = etat.toUpperCase(Locale.ROOT);
        if (!"L".equals(normalized) && !"N".equals(normalized)) {
            throw new IllegalArgumentException("L'état doit être 'L' (lu) ou 'N' (non lu)");
        }
        return normalized;
    }
}
