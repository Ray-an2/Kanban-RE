package com.kanban.carte.controller;

import com.kanban.carte.dtos.DragDropDto;
import com.kanban.carte.service.impl.DragDropServiceImpl;
import com.kanban.liste.dtos.ListeDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carte")
public class DragDropController {

    private final DragDropServiceImpl dragDropService;

    public DragDropController(DragDropServiceImpl dragDropService) {
        this.dragDropService = dragDropService;
    }

    /**
     * Déplace d'une carte et met à jour l'ordre des cartes dans les listes.
     * @param carId : identifiant de la carte
     * @param dragDropDto : contient sourceLisId, targetLisId et newOrdre
     * @return List<ListeDto>
     */
    @PatchMapping("/{carId}/drag-drop")
    public List<ListeDto> deplacerCarte(
            @PathVariable String carId,
            @Valid @RequestBody DragDropDto dragDropDto) {
        return dragDropService.deplacerCarte(carId, dragDropDto);
    }
}