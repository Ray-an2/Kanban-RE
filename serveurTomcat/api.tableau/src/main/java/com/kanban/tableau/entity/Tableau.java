package com.kanban.tableau.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "t_tableau_tab")
public class Tableau {
  @Id
  @Column(name = "tab_id")
  private String id;

  @Column(name = "tab_nom", nullable = false)
  private String nom;

  @Column(name = "tab_description")
  private String description;

  @Column(name = "tab_date", nullable = false)
  private String date;

  @Column(name = "tab_etat", nullable = false)
  private String etat;

  @Column(name = "tab_image")
  private String image;
}