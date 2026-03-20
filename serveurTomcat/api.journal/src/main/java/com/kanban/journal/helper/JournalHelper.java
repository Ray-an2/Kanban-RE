package com.kanban.journal.helper;

import com.kanban.journal.entity.Journal;
import com.kanban.journal.repository.JournalRepository;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class JournalHelper {

    private final JournalRepository journalRepository;

    public JournalHelper(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    /**
     * Crée une entrée de journal.
     * @param titre : Titre court de l'action
     * @param description Description détaillée
     * @param auteur: Pseudo de l'auteur
     * @param action: Code d'action (voir JournalAction.java)
     * @param tabId : Identifiant du tableau concerné (nullable)
     * @param carId: Identifiant de la carte concernée (nullable)
     */
    public void log(String titre, String description, String auteur,
                    String action, String tabId, String carId) {
        Journal journal = new Journal();
        journal.setId(UUID.randomUUID().toString());
        journal.setTitre(titre);
        journal.setDescription(description);
        journal.setAuteur(auteur != null ? auteur : "système");
        journal.setAction(action);
        journal.setDate(Instant.now().toString());
        journal.setEtat("A");
        journal.setTabId(tabId);
        journal.setCarId(carId);
        journalRepository.save(journal);
    }

    /**
     * Log lié au tableau
     * @param titre : Titre court de l'action
     * @param description Description détaillée
     * @param auteur: Pseudo de l'auteur
     * @param action: Code d'action (voir JournalAction.java)
     * @param tabId : Identifiant du tableau concerné
     * @param carId: Identifiant de la carte concernée (nullable)
     */
    public void logTableau(String titre, String description, String auteur, String action, String tabId) {
        log(titre, description, auteur, action, tabId, null);
    }

    /**
     * Log lié au carte
     * @param titre : Titre court de l'action
     * @param description Description détaillée
     * @param auteur: Pseudo de l'auteur
     * @param action: Code d'action (voir JournalAction.java)
     * @param tabId : Identifiant du tableau concerné (nullable)
     * @param carId : Identifiant de la carte concerné
     */
    public void logCarte(String titre, String description, String auteur, String action, String tabId, String carId) {
        log(titre, description, auteur, action, tabId, carId);
    }
}