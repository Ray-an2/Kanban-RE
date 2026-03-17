package com.kanban.role.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleDto {
  @NotBlank(message = "L'identifiant du compte est obligatoire")
  private String cptId;  // manque de la jointure vers leur table

  @NotBlank(message = "L'identifiant du tableau est obligatoire")
  private String tabId;   // manque de la jointure vers leur table

  @NotBlank(message = "Le role est obligatoire")
  private String rolRole;

  private String cptPseudo;
  private String tabNom;
}
