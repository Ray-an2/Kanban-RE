package com.kanban.tableau.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TableauDto {

  @JsonProperty("tab_id")
  private String id;

  @JsonProperty("tab_nom")
  private String nom;

  @JsonProperty("tab_description")
  private String description;

  @JsonProperty("tab_date")
  private String date;

  @JsonProperty("tab_etat")
  private String etat;

  @JsonProperty("tab_image")
  private String image;

  @JsonProperty("auteur")
  private String auteur;

  @JsonProperty("cptId")
  private String cptId;
}