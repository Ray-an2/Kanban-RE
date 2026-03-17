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

    @GetMapping("/title/{title}")
    public JournalDto getJournalByTitle(@PathVariable String title) {
        return journalService.getJournalByTitle(title);
    }

    @GetMapping("/author/{author}")
    public JournalDto getJournalByAuthor(@PathVariable String author) {
        return journalService.getJournalByAuthor(author);
    }

    @GetMapping("/action/{action}")
    public JournalDto getJournalByAction(@PathVariable String action) {
        return journalService.getJournalByAction(action);
    }

    @GetMapping("/date/{date}")
    public JournalDto getJournalByDate(@PathVariable String date) {
        return journalService.getJournalByDate(date);
    }

    @GetMapping("/etat/{etat}")
    public JournalDto getJournalByEtat(@PathVariable String etat) {
        return journalService.getJournalByEtat(etat);
    }

    @GetMapping("/tabId/{tabId}")
    public JournalDto getJournalByTabId(@PathVariable String tabId) {
        return journalService.getJournalByTabId(tabId);
    }

    @GetMapping("/carId/{carId}")
    public JournalDto getJournalByCarId(@PathVariable String carId) {
        return journalService.getJournalByCarId(carId);
    }

}
