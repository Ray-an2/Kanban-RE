package com.kanban.carte.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "t_carte_car")
public class Carte {

  @Id
  @Column(name = "car_id")
  private String id;

  @Column(name = "car_nom", nullable = false)
  private String nom;

  @Column(name = "car_description")
  private String description;

  @Column(name = "car_archiver", nullable = false)
  private String archiver;

  @Column(name = "car_terminer", nullable = false)
  private String terminer;

  @Column(name = "car_ordre", nullable = false)
  private String ordre;

  @Column(name = "car_priorite")
  private Integer priorite;

  @Column(name = "car_date_creation", nullable = false)
  private String dateCreation;

  @Column(name = "car_date_debut")
  private String dateDebut;

  @Column(name = "car_date_fin")
  private String dateFin;

  @Column(name = "car_couverture")
  private String couverture;

  @Column(name = "lis_id", nullable = false)
  private String lisId;
}