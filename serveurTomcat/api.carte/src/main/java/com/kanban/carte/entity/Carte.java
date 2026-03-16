package com.kanban.carte.entity;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Carte {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String nom;
  private String description;
  private String archiver;
  private String terminer;
  private String ordre;
  private Long priorite;
  private LocalDate dateCreation;
  private String dateDebut;
  private String dateFin;
  private String image;
}
