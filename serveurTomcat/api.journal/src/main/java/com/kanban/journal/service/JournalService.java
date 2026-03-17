package com.kanban.journal.service;

import com.kanban.journal.dtos.JournalDto;
import java.util.List;

public interface JournalService {
    JournalDto createJournal(JournalDto journalDto);
    JournalDto getJournalById(String id);
    List<JournalDto> getJournalByTabId(String tabId);
    List<JournalDto> getJournalByCarId(String carId);
    List<JournalDto> getByEtat(String etat);
}