package com.kanban.membre.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MembreDto {
    @NotBlank(message = "L'identifiant du compte est obligatoire")
    private String cptId;

    @NotBlank(message = "L'identifiant de la carte est obligatoire")
    private String carId;

    private String cptPseudo;
    private String carNom;
}
