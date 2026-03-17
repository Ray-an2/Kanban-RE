package com.kanban.associer.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssocierDto {
  @NotBlank(message = "L'identifiant de la carte est obligatoire")
  private String carId;

  @NotBlank(message = "L'identifiant de l'etiquette est obligatoire")
  private String etiId;

  private String carNom;
  private String etiNom;
}
