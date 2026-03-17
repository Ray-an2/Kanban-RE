package com.kanban.role.entity;

import com.kanban.compte.entity.Compte;
import com.kanban.tableau.entity.Tableau;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "t_role_rol")
@IdClass(RoleId.class)
@Data
public class Role {

  @Id
  @Column(name = "cpt_id", nullable = false)
  private String cptId;

  @Id
  @Column(name = "tab_id", nullable = false)
  private String tabId;

  @Column(name = "rol_role", nullable = false)
  private String rolRole;

  /**
   * Jointure vers t_compte_cpt.
   */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cpt_id", insertable = false, updatable = false)
  private Compte compte;

  /**
   * Jointure vers t_tableau_tab.
   */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "tab_id", insertable = false, updatable = false)
  private Tableau tableau;
}
