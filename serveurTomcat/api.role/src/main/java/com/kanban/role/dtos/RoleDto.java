package com.kanban.role.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleDto {
  @NotNull
  private Long idUser;  // manque de la jointure vers leur table

  @NotNull
  private Long idTab;   // manque de la jointure vers leur table

  @NotBlank(message = "Le role est obligatoire")
  private String role;
}
