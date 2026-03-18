package com.kanban.journal.service.impl;

import com.kanban.journal.dtos.JournalDto;
import com.kanban.journal.entity.Journal;
import com.kanban.journal.mappers.JournalMapper;
import com.kanban.journal.repository.JournalRepository;
import com.kanban.journal.service.JournalService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class JournalServiceImpl implements JournalService {
    private final JournalRepository journalRepository;
    private final JournalMapper journalMapper;

    public JournalServiceImpl(JournalRepository journalRepository, JournalMapper journalMapper) {
        this.journalRepository = journalRepository;
        this.journalMapper = journalMapper;
    }

    @Override
    public JournalDto createJournal(JournalDto journalDto) {
        var journal = journalMapper.toEntity(journalDto);
        journal.setId(UUID.randomUUID().toString());
        return journalMapper.toDto(journalRepository.save(journal));
    }

    @Override
    public JournalDto getJournalById(String id) {
        return journalRepository.findById(id)
                .map(journalMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Journal non trouvé avec l'id: " + id));
    }

    @Override
    public List<JournalDto> getJournalByTabId(String tabId) {
        return journalRepository.findByTabId(tabId)
                .stream().map(journalMapper::toDto).toList();
    }

    @Override
    public List<JournalDto> getJournalByCarId(String carId) {
        return journalRepository.findByCarId(carId)
                .stream().map(journalMapper::toDto).toList();
    }

    @Override
    public List<JournalDto> getByEtat(String etat) {
        return journalRepository.findByEtat(etat)
                .stream().map(journalMapper::toDto).toList();
    }

    @Override
    public Long countByTabId(String tabId) {
        return journalRepository.countByTabId(tabId);
    }

    @Override
    public JournalDto getLastByTabId(String tabId) {
        return journalRepository.findFirstByTabIdOrderByDateDesc(tabId)
                .map(journalMapper::toDto)
                .orElse(null);
    }
}