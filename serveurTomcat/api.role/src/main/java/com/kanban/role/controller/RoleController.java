package com.kanban.role.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kanban.role.dtos.RoleDto;
import com.kanban.role.service.impl.RoleServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/role")
public class RoleController {

  private final RoleServiceImpl roleService;

  public RoleController(RoleServiceImpl roleService) {
    this.roleService = roleService;
  }

  /**
   * Liste de tous les roles du sytemes.
   * @return List<RoleDto
   */
  @GetMapping
  public List<RoleDto> getAllRoles() {
    return roleService.getAllRole();
  }

  /**
   * Methode qui récupère les roles détenu par un utilisateur en particulier.
   * @return RoleDto
   */
  @GetMapping("/compte/{cptId}")
  public List<RoleDto> getRolesCompte(@PathVariable String cptId) {
    return roleService.getRoleByIdCompte(cptId);
  }

  /**
   * Methode qui récupère les utilisateurs avec leur roles détenu par un tableau en particulier.
   * @return RoleDto
   */
  @GetMapping("/tableau/{tabId}")
  public List<RoleDto> getRolesTab(@PathVariable String tabId) {
    return roleService.getRoleByIdTab(tabId);
  }

  /**
   * Associe un tableau à un utilisateur pour un role donnée.
   * @param roleDto :
   * @return List<RoleDto>
   */
  @PostMapping
  public ResponseEntity<RoleDto> associeRole(@Valid @RequestBody RoleDto roleDto) {
    RoleDto created = roleService.associerRole(roleDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  /**
   * Supprime l'association d'un utilisateur au tableau.
   * @param roleDto :
   * @return true si l'association est supprimée, false sinon
   */
  @DeleteMapping("/tableau/{tabId}/compte/{cptId}")
  public ResponseEntity<Void> deleteRole(@PathVariable String cptId, @PathVariable String tabId) {
    roleService.deleteRole(cptId, tabId);
    return ResponseEntity.noContent().build();
  }

  /**
   * Modifie le role d'un compte associe à un tableau.
   * @param roleDto
   * @return
   */
  @PutMapping("compte/{cptId}/tableau/{tabId}")
  public ResponseEntity<RoleDto> updateRole(@PathVariable String rolRole, @Valid @RequestBody RoleDto roleDto) {
    roleDto.setRolRole(rolRole);
    RoleDto updated = roleService.updateRole(roleDto);
    return ResponseEntity.ok(updated);
  }
}
