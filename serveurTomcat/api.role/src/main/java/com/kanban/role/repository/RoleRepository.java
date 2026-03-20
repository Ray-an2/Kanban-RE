package com.kanban.role.repository;

import com.kanban.role.entity.Role;
import com.kanban.role.entity.RoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, RoleId> {

  /**
   * Liste tous les tableau associé à un comptes passé en paramètre.
   * @param cptId : identifiant du compte
   * @return : Liste des tableaux du compte.
   */
  List<Role> findByCptId(String cptId);

  /**
   * Liste tous les comptes associé à un tableau passé en paramètre.
   * @param tabId : identifiant du tableau
   * @return : Liste des membres du tableau.
   */
  List<Role> findByTabId(String tabId);

  /**
   * Vérifie l'existence d'une association entre un compte et un tableau.
   * @param cptId : identifiant du compte
   * @param tabId : identifiant du tableau
   * @return true si l'association existe, false sinon.
   */
  boolean existsByCptIdAndTabId(String cptId, String tabId);
}
