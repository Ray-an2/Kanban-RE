package com.kanban.profil.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "t_profil_pfl")
public class Profil {

  @Id
  @Column(name = "cpt_id")
  private String compteId;

  @Column(name = "pfl_nom")
  private String nom;

  @Column(name = "pfl_prenom")
  private String prenom;

  @Column(name = "pfl_mail")
  private String mail;

  @Column(name = "pfl_etat", nullable = false)
  private String etat;

  @Column(name = "pfl_dateCreation")
  private String dateCreation;
}