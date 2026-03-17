package com.kanban.journal.service.impl;

import com.kanban.journal.dtos.JournalDto;
import com.kanban.journal.mappers.JournalMapper;
import com.kanban.journal.repositories.JournalRepository;

public class JournalServiceImpl extends JournalService {
    private final JournalRepository journalRepository;
    private final JournalMapper journalMapper;

    public JournalServiceImpl() {
        this.journalRepository = null;
        this.journalMapper = null;
    }

    public JournalServiceImpl(JournalRepository journalRepository, JournalMapper journalMapper) {
        this.journalRepository = journalRepository;
        this.journalMapper = journalMapper;
    }
    

    public JournalDto createJournal(JournalDto journalDto) {
        var journal = journalMapper.toEntity(journalDto);
        journal = journalRepository.save(journal);
        return journalMapper.toDto(journal);
    }

    public JournalDto getJournalById(String id) {
        var journal = journalRepository.findById(id);
        return journal != null ? journalMapper.toDto(journal) : null;
    }

    public JournalDto getJournalByTabId(String tabId) {
        var journal = journalRepository.findByTabId(tabId);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
    public JournalDto getJournalByCarId(String carId) {
        var journal = journalRepository.findByCarId(carId);
        return journal != null ? journalMapper.toDto(journal) : null;
    }

    public JournalDto putEtat(String etat) {
        var journal = journalRepository.findByEtat(etat);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
}