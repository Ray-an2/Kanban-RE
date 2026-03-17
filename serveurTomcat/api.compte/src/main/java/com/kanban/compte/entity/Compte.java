package com.kanban.compte.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "t_compte_cpt")
public class Compte {
  @Id
  @Column(name = "cpt_id")
  private String id;

  @Column(name = "cpt_pseudo", nullable = false, unique = true)
  private String pseudo;

  @Column(name = "cpt_mdp", nullable = false)
  private String mdp;

  @Column(name = "cpt_role", nullable = false)
  private String role;
}