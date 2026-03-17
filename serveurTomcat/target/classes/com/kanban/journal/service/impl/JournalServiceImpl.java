package com.kanban.journal.service.impl;

import com.kanban.journal.dtos.JournalDto;
import com.kanban.journal.mappers.JournalMapper;
import com.kanban.journal.repository.JournalRepository;
import com.kanban.journal.service.JournalService;

public class JournalServiceImpl extends JournalService {
    private final JournalRepository journalRepository;
    private final JournalMapper journalMapper;

    public JournalServiceImpl(JournalRepository journalRepository, JournalMapper journalMapper) {
        this.journalRepository = journalRepository;
        this.journalMapper = journalMapper;
    }
    public JournalServiceImpl() {
        this.journalRepository = null;
        this.journalMapper = null;
    }
    public JournalDto createJournal(JournalDto journalDto) {
        var journal = journalMapper.toEntity(journalDto);
        journal = journalRepository.save(journal);
        return journalMapper.toDto(journal);
    }
    public JournalDto getJournalById(String id) {
        var journal = journalRepository.findById(id).orElse(null);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
    public JournalDto getJournalByTitle(String title) {
        var journal = journalRepository.findByTitle(title).orElse(null);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
    public JournalDto getJournalByAuthor(String author) {
        var journal = journalRepository.findByAuthor(author).orElse(null);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
    public JournalDto getJournalByAction(String action) {
        var journal = journalRepository.findByAction(action).orElse(null);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
    public JournalDto getJournalByDate(String date) {
        var journal = journalRepository.findByDate(date).orElse(null);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
    public JournalDto getJournalByEtat(String etat) {
        var journal = journalRepository.findByEtat(etat).orElse(null);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
    public JournalDto getJournalByTabId(String tabId) {
        var journal = journalRepository.findByTabId(tabId).orElse(null);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
    public JournalDto getJournalByCarId(String carId) {
        var journal = journalRepository.findByCarId(carId).orElse(null);
        return journal != null ? journalMapper.toDto(journal) : null;
    }
}