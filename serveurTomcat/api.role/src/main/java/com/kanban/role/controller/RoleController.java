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

  /**
   * Liste tous les membres
   * @return List<RoleDto> : Liste de tous les membres.
   */
  @GetMapping
  public List<RoleDto> getAllRoles() {
    return roleService.getAllRole();
  }

  /**
   * Liste les tableau associé à un compte
   * @param cptId : identifiant du compte
   * @return Liste de tous les tableaux du compte.
   */
  @GetMapping("/compte/{cptId}")
  public List<RoleDto> getRolesCompte(@PathVariable String cptId) {
    return roleService.getRoleByCptId(cptId);
  }

  /**
   * Liste les membres d'un tableau.
   * @param tabId : identifiant du tableau
   * @return Liste de tous les membres du tableau.
   */
  @GetMapping("/tableau/{tabId}")
  public List<RoleDto> getRolesTab(@PathVariable String tabId) {
    return roleService.getRoleByTabId(tabId);
  }

  /**
   * Création d'une liaison entre un compte et un tableau.
   * @param roleDto : { "cptId": "...", "tabId": "..." }
   * @return une nouvelle liaison.
   */
  @PostMapping
  public ResponseEntity<RoleDto> associeRole(@Valid @RequestBody RoleDto roleDto) {
    RoleDto created = roleService.associerRole(roleDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  /**
   * Met à jour le role d'un membre d'un tableau.
   * @param cptId : identifiant du compte
   * @param tabId : identifiant du tableau
   * @param body : le nouveau role.
   * @return
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

  /**
   * Accepte une invitation d'un membre d'un tableau.
   * @param tabId : identifiant du tableau
   * @param body : { "cptId": "...", "roleCible": "..." }
   * @return
   */
  @PatchMapping("/tableau/{tabId}/invitation/accepter")
  public ResponseEntity<RoleDto> accepterInvitation(
          @PathVariable String tabId,
          @RequestBody java.util.Map<String, String> body) {
    String cptId = body.get("cptId");
    if (cptId == null || cptId.isBlank()) return ResponseEntity.badRequest().build();

    com.kanban.role.entity.RoleId id = new com.kanban.role.entity.RoleId(cptId, tabId);
    com.kanban.role.entity.Role role = roleService.getRoleEntity(cptId, tabId);
    if (role == null || !"E".equals(role.getRolRole()))
      return ResponseEntity.badRequest().build();

    String roleCible = body.get("roleCible");
    if (roleCible == null || roleCible.isBlank()) roleCible = "M";

    RoleDto updated = roleService.updateRole(cptId, tabId, roleCible);
    return ResponseEntity.ok(updated);
  }

  /**
   * Refuser une invitation d'un membre d'un tableau.
   * @param tabId : identifiant du tableau
   * @param body : { "cptId": "..." }
   * @return
   */
  @DeleteMapping("/tableau/{tabId}/invitation/refuser")
  public ResponseEntity<Void> refuserInvitation(
          @PathVariable String tabId,
          @RequestBody java.util.Map<String, String> body) {
    String cptId = body.get("cptId");
    if (cptId == null || cptId.isBlank()) return ResponseEntity.badRequest().build();
    roleService.deleteRole(cptId, tabId);
    return ResponseEntity.noContent().build();
  }

  /**
   * Supprime un membre d'un tableau.
   * @param cptId : identifiant du compte
   * @param tabId : identifiant du tableau
   * @return 204
   */
  @DeleteMapping("/tableau/{tabId}/compte/{cptId}")
  public ResponseEntity<Void> deleteRole(
          @PathVariable String cptId,
          @PathVariable String tabId) {
    roleService.deleteRole(cptId, tabId);
    return ResponseEntity.noContent().build();
  }
}