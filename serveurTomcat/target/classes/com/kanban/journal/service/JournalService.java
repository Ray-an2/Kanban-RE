package com.kanban.journal.service;

import com.kanban.journal.dtos.JournalDto;

public interface  JournalService {
    public JournalDto createJournal(JournalDto journalDto);
    public JournalDto getJournalById(String id);
    public JournalDto getJournalByTitle(String title);
    public JournalDto getJournalByAuthor(String author);
    public JournalDto getJournalByAction(String action);
    public JournalDto getJournalByDate(String date);
    public JournalDto getJournalByEtat(String etat);
    public JournalDto getJournalByTabId(String tabId);
    public JournalDto getJournalByCarId(String carId);
}
