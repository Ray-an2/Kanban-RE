package com.kanban.role.entity;


import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class RoleId implements Serializable {

  @Column(name = "cpt_id")
  private String cptId;

  @Column(name = "tab_id")
  private String tabId;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof RoleId)) return false;
    RoleId that = (RoleId) o;
    return Objects.equals(cptId, that.cptId) && Objects.equals(tabId, that.tabId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(cptId, tabId);
  }
}