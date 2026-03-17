package com.kanban.role.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kanban.role.dtos.RoleDto;
import com.kanban.role.service.impl.RoleServiceImpl;

import java.util.List;

@RestController
@RequestMapping("api/role")
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
    return roleService.getRoleByCptId(cptId);
  }

  /**
   * Methode qui récupère les utilisateurs avec leur roles détenu par un tableau en particulier.
   * @return RoleDto
   */
  @GetMapping("/tableau/{tabId}")
  public List<RoleDto> getRolesTab(@PathVariable String tabId) {
    return roleService.getRoleByTabId(tabId);
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
   * @param cptId : l'identifiant du compte utilisateur
   * @param tabId : l'identifiant du tableau
   * @return true si l'association est supprimée, false sinon
   */
  @DeleteMapping("/tableau/{tabId}/compte/{cptId}")
  public ResponseEntity<Void> deleteRole(@PathVariable String cptId, @PathVariable String tabId) {
    roleService.deleteRole(cptId, tabId);
    return ResponseEntity.noContent().build();
  }

  /**
   * Modifie le role d'un compte associe à un tableau.
   * @param rolRole : Le nouveau role de l'utilisateur
   * @return
   */
  /*@PutMapping("/compte/{cptId}/tableau/{tabId}")
  public ResponseEntity<RoleDto> updateRole(@PathVariable String rolRole) {
    RoleDto updated = roleService.updateRole(rolRole);
    return ResponseEntity.ok(updated);
  }*/
}
