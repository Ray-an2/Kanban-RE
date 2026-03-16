package com.kanban.tableau.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.Data;

@Entity
@Data
public class Tableau {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String nom;
  private String description;
  private String etat;
  private LocalDateTime dateCreation;
  private String image;
}
