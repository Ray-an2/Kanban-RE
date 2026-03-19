package com.kanban.journal.service.impl;

import com.kanban.journal.dtos.JournalDto;
import com.kanban.journal.entity.Journal;
import com.kanban.journal.mappers.JournalMapper;
import com.kanban.journal.repository.JournalRepository;
import com.kanban.journal.service.JournalService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * BUG CORRIGÉ : le fichier JournalServiceImpl.java était vide (0 octets)
 * en production, rendant le service journal complètement non fonctionnel.
 */
@Service
@Transactional
public class JournalServiceImpl implements JournalService {

    private final JournalRepository journalRepository;
    private final JournalMapper journalMapper;

    public JournalServiceImpl(JournalRepository journalRepository, JournalMapper journalMapper) {
        this.journalRepository = journalRepository;
        this.journalMapper = journalMapper;
    }

    @Override
    public JournalDto createJournal(JournalDto journalDto) {
        Journal journal = journalMapper.toEntity(journalDto);
        journal.setId(UUID.randomUUID().toString());

        // Injecter la date courante si absente
        if (journal.getDate() == null || journal.getDate().isBlank()) {
            journal.setDate(Instant.now().toString());
        }
        // État actif par défaut
        if (journal.getEtat() == null || journal.getEtat().isBlank()) {
            journal.setEtat("A");
        }

        return journalMapper.toDto(journalRepository.save(journal));
    }

    @Override
    @Transactional(readOnly = true)
    public JournalDto getJournalById(String id) {
        return journalRepository.findById(id)
                .map(journalMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Journal non trouvé avec l'id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JournalDto> getJournalByTabId(String tabId) {
        return journalRepository.findByTabId(tabId)
                .stream()
                .map(journalMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JournalDto> getJournalByCarId(String carId) {
        return journalRepository.findByCarId(carId)
                .stream()
                .map(journalMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JournalDto> getByEtat(String etat) {
        return journalRepository.findByEtat(etat)
                .stream()
                .map(journalMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByTabId(String tabId) {
        return journalRepository.countByTabId(tabId);
    }

    @Override
    @Transactional(readOnly = true)
    public JournalDto getLastByTabId(String tabId) {
        return journalRepository.findFirstByTabIdOrderByDateDesc(tabId)
                .map(journalMapper::toDto)
                .orElse(null);
    }
}