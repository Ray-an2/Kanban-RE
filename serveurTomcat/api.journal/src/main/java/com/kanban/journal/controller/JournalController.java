package com.kanban.journal.controller;

import com.kanban.journal.dtos.JournalDto;
import com.kanban.journal.service.impl.JournalServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/journal")
public class JournalController {
    private final JournalServiceImpl journalService;

    public JournalController(JournalServiceImpl journalService) {
        this.journalService = journalService;
    }

    @PostMapping
    public JournalDto createJournal(@RequestBody JournalDto journalDto) {
        return journalService.createJournal(journalDto);
    }

    @GetMapping("/{id}")
    public JournalDto getJournalById(@PathVariable String id) {
        return journalService.getJournalById(id);
    }

    @GetMapping("/tableau/{tabId}")
    public List<JournalDto> getJournalByTabId(@PathVariable String tabId) {
        return journalService.getJournalByTabId(tabId);
    }

    @GetMapping("/carte/{carId}")
    public List<JournalDto> getJournalByCarId(@PathVariable String carId) {
        return journalService.getJournalByCarId(carId);
    }

    @GetMapping("/etat/{etat}")
    public List<JournalDto> getByEtat(@PathVariable String etat) {
        return journalService.getByEtat(etat);
    }
}