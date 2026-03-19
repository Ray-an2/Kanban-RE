package com.kanban.liste.controller;

import com.kanban.liste.dtos.ListeDto;
import com.kanban.liste.dtos.OrdreCarteDto;
import com.kanban.liste.dtos.OrdreListeDto;
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

    // -------------------------------------------------------------------------
    // CRUD de base
    // -------------------------------------------------------------------------

    /** GET /api/liste/:id — récupérer une liste par son id */
    @GetMapping("/{id}")
    public ListeDto getListeById(@PathVariable String id) {
        return listeService.getListeById(id);
    }

    /** GET /api/liste/tableau/:tabId — listes publiées d'un tableau */
    @GetMapping("/tableau/{tabId}")
    public List<ListeDto> getListesByTableau(@PathVariable String tabId) {
        return listeService.getListesByTabId(tabId);
    }

    /** POST /api/liste — créer une liste */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListeDto createListe(@RequestBody ListeDto listeDto) {
        return listeService.createListe(listeDto);
    }

    /** PUT /api/liste/:id — modifier le titre d'une liste */
    @PutMapping("/{id}")
    public ListeDto updateListe(@PathVariable String id, @RequestBody ListeDto listeDto) {
        return listeService.updateListe(id, listeDto);
    }

    /** DELETE /api/liste/:id — supprimer une liste */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean deleteListe(@PathVariable String id) {
        return listeService.deleteListe(id);
    }

    // -------------------------------------------------------------------------
    // Archivage
    // -------------------------------------------------------------------------

    /** GET /api/liste/tableau/:tabId/archivees — listes archivées d'un tableau */
    @GetMapping("/tableau/{tabId}/archivees")
    public List<ListeDto> getListesArchivees(@PathVariable String tabId) {
        return listeService.getListesArchivees(tabId);
    }

    /** PATCH /api/liste/:id/archiver — archiver une liste et ses cartes */
    @PatchMapping("/{id}/archiver")
    public ListeDto archiverListe(@PathVariable String id) {
        return listeService.archiverListe(id);
    }

    /** PATCH /api/liste/:id/desarchiver — désarchiver une liste et ses cartes */
    @PatchMapping("/{id}/desarchiver")
    public ListeDto desarchiverListe(@PathVariable String id) {
        return listeService.desarchiverListe(id);
    }

    // -------------------------------------------------------------------------
    // Réorganisation
    // -------------------------------------------------------------------------

    /**
     * PUT /api/liste/tableau/:tabId/ordre
     * Réorganise l'ordre des listes d'un tableau.
     * Body : [{ "lisId": "...", "ordre": 1 }, ...]
     */
    @PutMapping("/tableau/{tabId}/ordre")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateOrdreListes(@PathVariable String tabId,
                                  @RequestBody List<OrdreListeDto> ordres) {
        listeService.updateOrdreListes(tabId, ordres);
    }

    /**
     * PUT /api/liste/:lisId/ordre-cartes
     * Réorganise l'ordre des cartes dans une liste.
     * Body : [{ "carId": "...", "ordre": 0 }, ...]
     */
    @PutMapping("/{lisId}/ordre-cartes")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateOrdreCartes(@PathVariable String lisId,
                                  @RequestBody List<OrdreCarteDto> ordres) {
        listeService.updateOrdreCartes(lisId, ordres);
    }
}