package com.kanban.journal.service;

import com.kanban.journal.dtos.JournalDto;

public interface  JournalService {
    JournalDto createJournal(JournalDto journalDto);
    JournalDto getJournalById(String id);
    JournalDto getJournalByTitle(String title);
    JournalDto getJournalByAuthor(String author);
    JournalDto getJournalByAction(String action);
    JournalDto getJournalByDate(String date);
    JournalDto getJournalByEtat(String etat);
    JournalDto getJournalByTabId(String tabId);
    JournalDto getJournalByCarId(String carId);
}
