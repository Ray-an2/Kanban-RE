package com.kanban.role.entity;

import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class Role {
  private Long idUser;
  private Long idTab;
  private String role;
}
