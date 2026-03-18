package com.kanban.liste.service;

import com.kanban.liste.dtos.ListeDto;

import java.util.List;

public interface ListeService {
    ListeDto createListe(ListeDto listeDto);
    ListeDto getListeById(String id);
    List<ListeDto> getListesByTabId(String tabId);
    boolean deleteListe(String id);
}