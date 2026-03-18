package com.kanban.role.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleId implements Serializable {

  @Column(name = "cpt_id")
  private String cptId;

  @Column(name = "tab_id")
  private String tabId;
}