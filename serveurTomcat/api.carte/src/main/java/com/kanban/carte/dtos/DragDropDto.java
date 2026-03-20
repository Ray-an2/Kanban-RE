package com.kanban.carte.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DragDropDto {

    @NotBlank(message = "La liste source est obligatoire")
    private String sourceLisId;

    @NotBlank(message = "La liste cible est obligatoire")
    private String targetLisId;

    @Min(value = 0, message = "L'ordre doit être >= 0")
    private int newOrdre;
}