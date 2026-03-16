package com.kanban.role.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleDto {
  @NotNull
  private Long idUser;

  @NotNull
  private Long idTab;

  @NotBlank(message = "Le role est obligatoire")
  private String role;
}
