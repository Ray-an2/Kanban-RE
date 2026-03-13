package com.kanban.compte.dtos;

@Data
public class CompteDto {
  @NotNull
  private Long id;

  @NotBlank(message = "Le pseudo est obligatoire")
  private String pseudo;
  @NotBlank(message = "Le mot de passe est obligatoire")
  private String mdp;
  @NotBlank(message = "Le rôle est obligatoire")
  private String role;
}
