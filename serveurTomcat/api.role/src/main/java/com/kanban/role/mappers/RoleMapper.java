package com.kanban.role.mappers;

import com.kanban.role.dto.RoleDto;
import com.kanban.role.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
  public RoleDto toDto(Role role){
    if(role==null){
      return null;
    }
    RoleDto roleDto = new RoleDto();
    roleDto.setCptId(role.getCptId());
    roleDto.setTabId(role.getTabId());
    roleDto.setRolRole(role.getRolRole());
    if(role.getCompte() != null) {
      roleDto.getCptPseudo(role.getCompte().getCptPseudo());
    }
    if(role.getTableau() != null) {
      roleDto.getTabNom(role.getTableau().getTabNom());
    }
    return roleDto;
  }

  public Role toEntity(RoleDto roleDto){
    if(roleDto==null){
      return null;
    }
    Role role = new Role();
    role.setCptId(roleDto.getCptId());
    role.setTabId(roleDto.getTabId());
    role.setRolRole(roleDto.getRolRole());
    return role;
  }
}
