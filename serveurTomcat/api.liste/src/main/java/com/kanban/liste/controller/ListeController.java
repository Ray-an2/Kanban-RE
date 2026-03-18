package com.kanban.liste.controller;

import com.kanban.liste.dtos.ListeDto;
import com.kanban.liste.service.impl.ListeServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/liste")
public class ListeController {

    private final ListeServiceImpl listeService;

    public ListeController(ListeServiceImpl listeService) {
        this.listeService = listeService;
    }

    @GetMapping("/{id}")
    public ListeDto getListeById(@PathVariable String id) {
        return listeService.getListeById(id);
    }

    @GetMapping("/tableau/{tabId}")
    public List<ListeDto> getListesByTableau(@PathVariable String tabId) {
        return listeService.getListesByTabId(tabId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListeDto createListe(@RequestBody ListeDto listeDto) {
        return listeService.createListe(listeDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean deleteListe(@PathVariable String id) {
        return listeService.deleteListe(id);
    }
}