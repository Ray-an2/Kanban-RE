package com.kanban.carte.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CarteDto {

  @JsonProperty("car_id")
  private String id;

  @JsonProperty("car_nom")
  private String nom;

  @JsonProperty("car_description")  // corrigé : était "car_des"
  private String description;

  @JsonProperty("car_archiver")
  private String archiver;

  @JsonProperty("car_terminer")
  private String terminer;

  @JsonProperty("car_ordre")
  private String ordre;

  @JsonProperty("car_priorite")
  private Integer priorite;

  @JsonProperty("car_date_creation")  // corrigé : était "car_dateCreation"
  private String dateCreation;

  @JsonProperty("car_date_debut")     // corrigé : était "car_dateDebut"
  private String dateDebut;

  @JsonProperty("car_date_fin")       // corrigé : était "car_dateFin"
  private String dateFin;

  @JsonProperty("car_couverture")
  private String couverture;

  @JsonProperty("lis_id")
  private String lisId;
}