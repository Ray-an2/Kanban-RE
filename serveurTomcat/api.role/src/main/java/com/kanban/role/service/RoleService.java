package com.kanban.role.service;

import com.kanban.role.dtos.RoleDto;

import java.util.List;


public interface RoleService {
  /**
   * Liste de tous les liens présent.
   * @return List<RoleDto>
   */
  List<RoleDto> getAllRole();

  /**
   * Methode qui récupère les roles détenu par un utilisateur en particulier.
   * @return RoleDto
   */
  List<RoleDto> getRoleByCptId(String cptId);

  /**
   * Methode qui récupère les utilisateurs avec leur roles détenu par un tableau en particulier.
   * @return RoleDto
   */
  List<RoleDto> getRoleByTabId(String tabId);

  /**
   * Associe un tableau à un utilisateur pour un role donnée.
   * @return List<RoleDto
   */
  RoleDto associerRole(RoleDto roleDto);

  /**
   * Supprime l'association d'un utilisateur au tableau.
   * @param roleDto
   * @return true si l'association est supprimée, false sinon
   */
  void deleteRole(String cptId, String tabId);

  //RoleDto updateRole(String rolRole);
}
