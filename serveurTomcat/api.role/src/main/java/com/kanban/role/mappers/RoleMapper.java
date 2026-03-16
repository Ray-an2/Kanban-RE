package com.kanban.role.mappers;

import com.kanban.role.dto.RoleDto;
import com.kanban.role.entity.Role;
import org.springframework.stereotype.Component;
import java.util.Objects;

@Component
public class RoleMapper {
  public RoleDto toDto(Role role){
    if(role==null){
      return null;
    }
    RoleDto roleDto = new RoleDto();
    roleDto.setIdUser(role.getIdUser());
    roleDto.setIdTab(role.getIdTab());
    roleDto.setRole(role.getRole());
    return roleDto;
  }

  public Role toEntity(RoleDto roleDto){
    if(roleDto==null){
      return null;
    }
    Role role = new Role();
    if(roleDto.getIdUser() != null){
      role.setIdUser(roleDto.getIdUser());
    }
    if(roleDto.getIdTab() != null) {
      role.setIdTab(roleDto.getIdTab());
    }
    role.setRole(roleDto.getRole());
    return role;
  }
}
