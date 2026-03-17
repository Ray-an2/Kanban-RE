package com.kanban.journal.service;

import com.kanban.journal.dtos.JournalDto;

public interface  JournalService {
    public JournalDto createJournal(JournalDto journalDto);
    public JournalDto getJournalById(String id);
    public JournalDto getJournalByTabId(String tabId);
    public JournalDto getJournalByCarId(String carId);
    public JournalDto putEtat(String etat);
}
