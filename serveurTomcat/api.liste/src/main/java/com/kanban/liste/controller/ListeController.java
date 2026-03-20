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

    /**
     * Récupère une liste par son id
     * @param id : identifiant de la liste
     * @return Une liste
     */
    @GetMapping("/{id}")
    public ListeDto getListeById(@PathVariable String id) {
        return listeService.getListeById(id);
    }

    /**
     * Récupère toutes les listes d'un tableau
     * @param tabId : identifiant du tableau
     * @return Liste de toutes les listes d'un tableau
     */
    @GetMapping("/tableau/{tabId}")
    public List<ListeDto> getListesByTableau(@PathVariable String tabId) {
        return listeService.getListesByTabId(tabId);
    }

    /**
     * Crée une liste
     * @param listeDto : au minimum le nom de la liste
     * @return
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListeDto createListe(@RequestBody ListeDto listeDto) {
        return listeService.createListe(listeDto);
    }

    /**
     * Modifie le titre d'une liste
     * @param id : identifiant de la liste
     * @param listeDto : nouveau titre de la liste
     * @return
     */
    @PutMapping("/{id}")
    public ListeDto updateListe(@PathVariable String id, @RequestBody ListeDto listeDto) {
        return listeService.updateListe(id, listeDto);
    }

    /**
     * Supprime une liste
     * @param id : identifiant de la liste
     * @return
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean deleteListe(@PathVariable String id) {
        return listeService.deleteListe(id);
    }

    /**
     * Liste tous les listes archivées d'un tableau
     * @param tabId : identifiant du tableau
     * @return List<ListeDto> liste archivée d'un tableau
     */
    @GetMapping("/tableau/{tabId}/archivees")
    public List<ListeDto> getListesArchivees(@PathVariable String tabId) {
        return listeService.getListesArchivees(tabId);
    }

    /**
     * Archiver une liste et ses cartes
     * @param id : identifiant de la liste
     * @return
     */
    @PatchMapping("/{id}/archiver")
    public ListeDto archiverListe(@PathVariable String id) {
        return listeService.archiverListe(id);
    }

    /**
     * Désarchiver une liste et ses cartes.
     * @param id : identifiant de la liste
     * @return
     */
    @PatchMapping("/{id}/desarchiver")
    public ListeDto desarchiverListe(@PathVariable String id) {
        return listeService.desarchiverListe(id);
    }

    /**
     * Met à jour l'ordre des listes d'un tableau.
     * @param tabId : identifiant du tableau
     * @param ordres : nouvelle ordre des listes
     */
    @PutMapping("/tableau/{tabId}/ordre")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateOrdreListes(@PathVariable String tabId,
                                  @RequestBody List<OrdreListeDto> ordres) {
        listeService.updateOrdreListes(tabId, ordres);
    }

    /**
     * Met à jour l'ordre des cartes d'une liste.
     * @param lisId : identifiant de la liste
     * @param ordres : nouvel ordre des cartes
     */
    @PutMapping("/{lisId}/ordre-cartes")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateOrdreCartes(@PathVariable String lisId,
                                  @RequestBody List<OrdreCarteDto> ordres) {
        listeService.updateOrdreCartes(lisId, ordres);
    }
}