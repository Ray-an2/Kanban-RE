package com.kanban.role.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kanban.role.dtos.RoleDto;
import com.kanban.role.service.RoleServiceImpl;

@RestController
@RequestMapping("/role")
public class RoleController {
  private final RoleServiceImpl roleService;

  public RoleController(RoleServiceImpl roleService) {
    this.roleService = roleService;
  }

  /**
   * Liste de tous les liens présent.
   * @return List<RoleDto
   */
  @GetMapping
  public List<RoleDto> getRole() {
    return roleService.getAllRole();
  }

  /**
   * Methode qui récupère les roles détenu par un utilisateur en particulier.
   * @return RoleDto
   */
  GetMapping("/user/{id}")
  public List<RoleDto> getRolesUser(@PathVariable Long idUser) {
    return roleService.getRoleByIdUser(idUser);
  }

  /**
   * Methode qui récupère les utilisateurs avec leur roles détenu par un tableau en particulier.
   * @return RoleDto
   */
  GetMapping("/tableau/{id}")
  public List<RoleDto> getRolesTab(@PathVariable Long idTab) {
    return roleService.getRoleByIdTab(idTab);
  }

  /**
   * Associe un tableau à un utilisateur pour un role donnée.
   * @return List<RoleDto
   */
  @PostMapping
  public RoleDto AssocieRole(final @RequestBody RoleDto roleDto) {
    return roleService.AssocieRole(roleDto);
  }

  /**
   * Supprime l'association d'un utilisateur au tableau.
   * @param roleDto
   * @return true si l'association est supprimée, false sinon
   */
  @DeleteMapping
  public boolean deleteRole(final @RequestBody RoleDto roleDto) {
    return roleService.deleteRole(roleDto);
  }
}
