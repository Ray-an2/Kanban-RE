package com.kanban.journal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kanban.journal.dtos.JournalDto;
import com.kanban.journal.service.impl.JournalServiceImpl;

@RestController
@RequestMapping("/journal")
public class JournalController {
    private final JournalServiceImpl journalService;

    public JournalController() {
        this.journalService = null;
    }

    public JournalController(JournalServiceImpl journalService) {
        this.journalService = journalService;
    }
    
    @PostMapping
    public JournalDto createJournal(final @RequestBody JournalDto journalDto) {
        return journalService.createJournal(journalDto);
    }

    @GetMapping("/{id}")
    public JournalDto getJournalById(@PathVariable String id) {
        return journalService.getJournalById(id);
    }

    @GetMapping("/tableau/{tabId}")
    public JournalDto getJournalByTabId(@PathVariable String tabId) {
        return journalService.getJournalByTabId(tabId);
    }

    @GetMapping("/carte/{carId}")
    public JournalDto getJournalByCarId(@PathVariable String carId) {
        return journalService.getJournalByCarId(carId);
    }

    @GetMapping("/{etat")
    public JournalDto putEtat(@PathVariable String etat){ return journalService.putEtat(etat);}
}
