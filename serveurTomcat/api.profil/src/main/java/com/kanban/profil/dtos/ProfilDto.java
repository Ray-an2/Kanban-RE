package com.kanban.profil.dtos;

import lombok.Data;

@Data
public class ProfilDto {
  private String compteId;
  private String nom;
  private String prenom;
  private String mail;
  private String etat;
  private String dateCreation;
}