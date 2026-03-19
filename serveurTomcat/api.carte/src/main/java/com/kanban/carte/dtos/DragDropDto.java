package com.kanban.carte.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO unifié pour les opérations de drag & drop d'une carte.
 *
 * Couvre deux cas d'usage :
 *  1. Déplacement vers une autre liste (sourceLisId ≠ targetLisId)
 *  2. Réorganisation dans la même liste (sourceLisId == targetLisId)
 *
 * Exemple de body JSON :
 * {
 *   "sourceLisId": "lis_rm_backlog",
 *   "targetLisId": "lis_rm_en_cours",
 *   "newOrdre": 2
 * }
 */
@Data
public class DragDropDto {

    @NotBlank(message = "La liste source est obligatoire")
    private String sourceLisId;

    @NotBlank(message = "La liste cible est obligatoire")
    private String targetLisId;

    @Min(value = 0, message = "L'ordre doit être >= 0")
    private int newOrdre;
}