package com.kanban.carte.service;

import com.kanban.carte.dtos.DragDropDto;
import com.kanban.liste.dtos.ListeDto;

import java.util.List;

public interface DragDropService {

    /**
     * Déplace une carte avec renumérotation complète des listes source et cible.
     *
     * @param carId      identifiant de la carte à déplacer
     * @param dragDropDto contient sourceLisId, targetLisId et newOrdre
     * @return les listes affectées mises à jour (source + cible)
     */
    List<ListeDto> deplacerCarte(String carId, DragDropDto dragDropDto);
}