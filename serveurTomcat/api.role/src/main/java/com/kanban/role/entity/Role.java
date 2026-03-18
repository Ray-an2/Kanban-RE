package com.kanban.role.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "t_role_rol")
public class Role {

  @EmbeddedId
  private RoleId id = new RoleId();

  @Column(name = "rol_role")
  private String rolRole;

  public String getCptId() { return id.getCptId(); }
  public String getTabId() { return id.getTabId(); }

  public void setCptId(String cptId) { id.setCptId(cptId); }
  public void setTabId(String tabId) { id.setTabId(tabId); }
}