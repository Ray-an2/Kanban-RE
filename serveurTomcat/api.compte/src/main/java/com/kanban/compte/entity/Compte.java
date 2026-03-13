package com.kanban.compte.entity;

@Entity
public class Compte {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String pseudo;
  private String mdp;
  private String role;
}
