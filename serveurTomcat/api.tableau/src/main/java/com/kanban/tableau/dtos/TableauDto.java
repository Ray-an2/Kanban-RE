package com.kanban.tableau.dtos;

import lombok.Data;

@Data
public class TableauDto {
  private String id;
  private String nom;
  private String description;
  private String date;
  private String etat;
  private String image;
}