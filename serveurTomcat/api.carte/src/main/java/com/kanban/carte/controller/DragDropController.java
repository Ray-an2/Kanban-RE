package com.kanban.carte.controller;

import com.kanban.carte.dtos.DragDropDto;
import com.kanban.carte.service.impl.DragDropServiceImpl;
import com.kanban.liste.dtos.ListeDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller dédié aux opérations de drag & drop de cartes.
 *
 * Endpoint unique :
 *   PATCH /api/carte/:carId/drag-drop
 *
 * Body JSON :
 * {
 *   "sourceLisId": "lis_rm_backlog",
 *   "targetLisId": "lis_rm_en_cours",
 *   "newOrdre": 2
 * }
 *
 * Retourne les listes affectées avec leurs cartes mises à jour
 * (la liste source et la liste cible si elles sont différentes).
 * Le frontend peut ainsi mettre à jour son state en une seule réponse.
 */
@RestController
@RequestMapping("/api/carte")
public class DragDropController {

    private final DragDropServiceImpl dragDropService;

    public DragDropController(DragDropServiceImpl dragDropService) {
        this.dragDropService = dragDropService;
    }

    /**
     * PATCH /api/carte/:carId/drag-drop
     *
     * Déplace une carte avec renumérotation complète.
     * Fonctionne aussi bien pour :
     *  - un déplacement vers une autre liste
     *  - un réordonnancement dans la même liste
     */
    @PatchMapping("/{carId}/drag-drop")
    public List<ListeDto> deplacerCarte(
            @PathVariable String carId,
            @Valid @RequestBody DragDropDto dragDropDto) {
        return dragDropService.deplacerCarte(carId, dragDropDto);
    }
}