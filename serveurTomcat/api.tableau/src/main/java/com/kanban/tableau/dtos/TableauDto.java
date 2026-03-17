package com.kanban.tableau.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TableauDto {
  @NotNull
  private String id;

  @NotBlank(message = "Le nom est obligatoire")
  private String nom;

  private String description;

  @NotBlank(message = "Un etat est obligatoire")
  private String etat;

  private String image;
}
