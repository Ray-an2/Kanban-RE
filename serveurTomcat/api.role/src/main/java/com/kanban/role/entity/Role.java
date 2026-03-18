package com.kanban.role.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "t_role_rol")
public class Role {

  @Id
  @Column(name = "cpt_id")
  private String cptId;

  @Column(name = "tab_id")
  private String tabId;

  @Column(name = "rol_role")
  private String role;
}