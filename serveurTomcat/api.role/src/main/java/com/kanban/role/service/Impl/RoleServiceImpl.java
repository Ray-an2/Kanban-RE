package com.kanban.role.services.impl;

import com.kanban.role.dtos.RoleDto;
import com.kanban.role.entities.Role;
import com.kanban.role.repositories.RoleRepository;
import com.kanban.role.services.RoleService;
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

  private final DogRepository dogRepository;
  private final DogMapper dogMapper;

  /**
   * Constructeur avec injection des dépendances
   * L'injection par constructeur est préférée à @Autowired car :
   * - Elle rend les dépendances obligatoires
   * - Elle facilite les tests unitaires
   * - Elle permet l'immutabilité
   */
  public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
    this.roleRepository = roleRepository;
    this.roleMapper = roleMapper;
  }

  /**
   * Associe un tableau à un utilisateur pour un role donnée.
   * @return List<RoleDto
   */
  @Override
  public RoleDto AssocieRole(RoleDto roleDto) {
    var role = roleMapper.toEntity(roleDto);
    var savedRole = roleRepository.save(role);
    return roleMapper.toDto(savedRole);
  }

  /**
   * Methode qui récupère les roles détenu par un utilisateur en particulier.
   * @return RoleDto
   */
  @Override
  @Transactional(readOnly = true)
  public List<RoleDto> getRoleByIdUser(Long idUser) {
    var role = roleRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Role non trouvé pour l'utilisateur avec l'id: " + id));
    return List.of(roleMapper.toDto(role));
  }

  /**
   * Methode qui récupère les utilisateurs avec leur roles détenu par un tableau en particulier.
   * @return RoleDto
   */
  @Override
  @Transactional(readOnly = true)
  public List<RoleDto> getRoleByIdTab(Long id) {
    var role = roleRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Aucun Utilisateurs n'a été trouvé dans le tableau avec l'id: " + id));
    return List.of(roleMapper.toDto(role));
  }

  /**
   * Supprime l'association d'un utilisateur au tableau.
   * @param roleDto
   * @return true si l'association est supprimée, false sinon
   */
  @Override
  public boolean deleteRole(RoleDto roleDto) {
    var role = roleMapper.toEntity(roleDto);
    try {
      roleRepository.deleteById(role.getId());
      return true;
    } catch (Exception e) {
      System.err.println("Erreur supprimer role: " + e.getMessage());
      return false;
    }
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
}