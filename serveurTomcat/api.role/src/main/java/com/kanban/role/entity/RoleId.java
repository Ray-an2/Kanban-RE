package com.kanban.role.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class RoleId implements Serializable {

  @Column(name = "cpt_id")
  private String cptId;

  @Column(name = "tab_id")
  private String tabId;
}