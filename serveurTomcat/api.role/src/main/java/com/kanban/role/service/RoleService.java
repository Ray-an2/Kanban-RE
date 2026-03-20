package com.kanban.role.service;

import com.kanban.role.dtos.RoleDto;
import java.util.List;

public interface RoleService {

  List<RoleDto> getAllRole();

  List<RoleDto> getRoleByCptId(String cptId);

  List<RoleDto> getRoleByTabId(String tabId);

  RoleDto associerRole(RoleDto roleDto);

  void deleteRole(String cptId, String tabId);

  RoleDto updateRole(String cptId, String tabId, String newRole);

  // Accès direct à l'entité (pour vérifier le rôle E avant acceptation)
  com.kanban.role.entity.Role getRoleEntity(String cptId, String tabId);
}