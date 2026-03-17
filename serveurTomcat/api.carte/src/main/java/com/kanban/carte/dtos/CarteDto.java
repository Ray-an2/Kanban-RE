package com.kanban.carte.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class CarteDto {
  @NotNull
  private String id;

  @NotBlank(message = "Le nom est obligatoire")
  private String nom;

  private String description;

  @NotBlank(message = "Il est obligatoire de savoir si il est archiver ou non")
  private String archiver;

  @NotBlank(message = "Il est obligatoire de savoir si il est terminer ou non")
  private String terminer;

  @NotBlank(message = "L'ordre de la carte est obligatoire")
  private String ordre;

  private Integer priorite;

  private String dateCreation;

  private String dateDebut;

  private String dateFin;

  private String couverture;

  private String lisId;
}
