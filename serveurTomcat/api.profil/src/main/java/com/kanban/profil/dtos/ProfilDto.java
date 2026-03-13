package com.kanban.profil.dtos;

public class ProfilDto {
  @NotNull
  private Long CompteId;

  @NotBlank(message = "Le nom est obligatoire")
  private String nom;

  @NotBlank(message = "Le prénom est obligatoire")
  private String prenom;

  @Email(message = "L'adresse e-mail doit être valide")
  private String mail;

  @NotBlank(message = "L'état est obligatoire")
  private String etat;

  @NotBlank(message = "La date de création est obligatoire")
  private LocalDate dateCreation;

}
