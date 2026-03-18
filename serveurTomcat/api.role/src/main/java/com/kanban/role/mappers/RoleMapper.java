package com.kanban.role.mappers;

import com.kanban.role.dtos.RoleDto;
import com.kanban.role.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

  public RoleDto toDto(Role role) {
    if (role == null) return null;
    RoleDto dto = new RoleDto();
    dto.setCptId(role.getCptId());
    dto.setTabId(role.getTabId());
    dto.setRolRole(role.getRole());
    return dto;
  }

  public Role toEntity(RoleDto dto) {
    if (dto == null) return null;
    Role role = new Role();
    role.setCptId(dto.getCptId());
    role.setTabId(dto.getTabId());
    role.setRole(dto.getRolRole());
    return role;
  }
}