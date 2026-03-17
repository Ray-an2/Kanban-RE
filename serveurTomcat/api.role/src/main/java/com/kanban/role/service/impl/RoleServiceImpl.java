package com.kanban.role.service.impl;

import com.kanban.role.dtos.RoleDto;
import com.kanban.role.entity.Role;
import com.kanban.role.entity.RoleId;
import com.kanban.role.repository.RoleRepository;
import com.kanban.role.service.RoleService;
import com.kanban.role.mappers.RoleMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Implémentation des opérations métier pour la gestion des roles.
 * Cette classe suit le principe de Single Responsibility (SOLID).
 */
@Service("RoleService")
@Transactional
public class RoleServiceImpl implements RoleService {

  private final RoleRepository roleRepository;
  private final RoleMapper roleMapper;

  public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
    this.roleRepository = roleRepository;
    this.roleMapper = roleMapper;
  }

  /**
   * Retourne tous les tableaux associé à un compte
   * @param cptId : id du compte
   * @return List<RoleDto>
   */
  @Override
  @Transactional(readOnly = true)
  public List<RoleDto> getRoleByCptId(String cptId) {
    List<Role> roles = roleRepository.findByCptId(cptId);
    if (roles.isEmpty()) {
      throw new EntityNotFoundException("Aucun rôle trouvé pour le compte : " + cptId);
    }
    return roles.stream().map(roleMapper::toDto).toList();
  }

  /**
   * Retourne tous les membres d'un tableau avec leur rôle.
   * @param tabId : id du tableau
   * @return List<RoleDto>
   */
  @Override
  @Transactional(readOnly = true)
  public List<RoleDto> getRoleByTabId(String tabId) {
    List<Role> roles = roleRepository.findByTabId(tabId);
    if (roles.isEmpty()) {
      throw new EntityNotFoundException("Aucun membre trouvé pour le tableau : " + tabId);
    }
    return roles.stream().map(roleMapper::toDto).toList();
  }

  /**
   * Associe un compte à un tableau avec un rôle donné.
   * Vérifie que l'association n'existe pas déjà.
   * @param roleDto
   * @return RoleDto
   */
  @Override
  public RoleDto associerRole(RoleDto roleDto) {
    if (roleRepository.existsByCptIdAndTabId(roleDto.getCptId(), roleDto.getTabId())) {
      throw new IllegalStateException(
          "Le compte " + roleDto.getCptId() + " a déjà un rôle sur ce tableau."
      );
    }
    Role role = roleMapper.toEntity(roleDto);
    Role saved = roleRepository.save(role);
    return roleMapper.toDto(saved);
  }

  /**
   * Supprime l'association compte-tableau (retire le membre du tableau).
   * @param cptId : id du compte
   * @param tabId : id du tableau
   */
  @Override
  public void deleteRole(String cptId, String tabId) {
    RoleId id = new RoleId(cptId, tabId);
    if (!roleRepository.existsById(id)) {
      throw new EntityNotFoundException(
          "Association introuvable pour compte=" + cptId + " tableau=" + tabId
      );
    }
    roleRepository.deleteById(id);
  }

  /**
   * Liste tous les roles présent dans le systemes
   * @return List<RoleDto>
   */
  @Override
  @Transactional(readOnly = true)
  public List<RoleDto> getAllRole() {
    return roleRepository.findAll().stream()
        .map(roleMapper::toDto)
        .toList();
  }

  @Override
  public RoleDto updateRole(String rolRole) {
    RoleDto updated = setRolRole(RoleDto.getRolRole());
    return updated;
  }
}