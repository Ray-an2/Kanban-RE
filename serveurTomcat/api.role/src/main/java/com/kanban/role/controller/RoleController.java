package com.kanban.role.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kanban.role.dtos.RoleDto;
import com.kanban.role.service.impl.RoleServiceImpl;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/role")
public class RoleController {

  private final RoleServiceImpl roleService;

  public RoleController(RoleServiceImpl roleService) {
    this.roleService = roleService;
  }

  /** GET /api/role — tous les rôles */
  @GetMapping
  public List<RoleDto> getAllRoles() {
    return roleService.getAllRole();
  }

  /** GET /api/role/compte/:cptId — rôles d'un compte */
  @GetMapping("/compte/{cptId}")
  public List<RoleDto> getRolesCompte(@PathVariable String cptId) {
    return roleService.getRoleByCptId(cptId);
  }

  /** GET /api/role/tableau/:tabId — membres d'un tableau avec leur rôle */
  @GetMapping("/tableau/{tabId}")
  public List<RoleDto> getRolesTab(@PathVariable String tabId) {
    return roleService.getRoleByTabId(tabId);
  }

  /** POST /api/role — associer un compte à un tableau */
  @PostMapping
  public ResponseEntity<RoleDto> associeRole(@Valid @RequestBody RoleDto roleDto) {
    RoleDto created = roleService.associerRole(roleDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  /**
   * PATCH /api/role/tableau/:tabId/compte/:cptId
   * Modifie le rôle d'un membre dans un tableau.
   * Body : { "role": "A" }
   */
  @PatchMapping("/tableau/{tabId}/compte/{cptId}")
  public ResponseEntity<RoleDto> updateRole(
          @PathVariable String cptId,
          @PathVariable String tabId,
          @RequestBody Map<String, String> body) {

    String newRole = body.get("role");
    if (newRole == null || newRole.isBlank()) {
      return ResponseEntity.badRequest().build();
    }
    RoleDto updated = roleService.updateRole(cptId, tabId, newRole);
    return ResponseEntity.ok(updated);
  }

  /** DELETE /api/role/tableau/:tabId/compte/:cptId — retirer un membre */
  @DeleteMapping("/tableau/{tabId}/compte/{cptId}")
  public ResponseEntity<Void> deleteRole(
          @PathVariable String cptId,
          @PathVariable String tabId) {
    roleService.deleteRole(cptId, tabId);
    return ResponseEntity.noContent().build();
  }
}