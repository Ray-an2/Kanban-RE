package com.kanban.profil.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Profil {
  private String nom;
  private String prenom;
  private String mail;
  private String etat;
  private LocalDate dateCreation;

  private Long CompteId; // compte id à faire joindre
}
