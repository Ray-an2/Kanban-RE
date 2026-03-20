package com.kanban.liste.service;

import com.kanban.liste.dtos.ListeDto;
import com.kanban.liste.dtos.OrdreCarteDto;
import com.kanban.liste.dtos.OrdreListeDto;

import java.util.List;

public interface ListeService {

    ListeDto createListe(ListeDto listeDto);
    ListeDto getListeById(String id);
    List<ListeDto> getListesByTabId(String tabId);
    ListeDto updateListe(String id, ListeDto listeDto);
    boolean deleteListe(String id);

    ListeDto archiverListe(String id);
    ListeDto desarchiverListe(String id);
    List<ListeDto> getListesArchivees(String tabId);

    void updateOrdreListes(String tabId, List<OrdreListeDto> ordres);
    void updateOrdreCartes(String lisId, List<OrdreCarteDto> ordres);
}