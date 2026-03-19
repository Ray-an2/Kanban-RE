package com.kanban.role.service.impl;

import com.kanban.journal.helper.JournalAction;
import com.kanban.journal.helper.JournalHelper;
import com.kanban.role.dtos.RoleDto;
import com.kanban.role.entity.Role;
import com.kanban.role.entity.RoleId;
import com.kanban.role.mappers.RoleMapper;
import com.kanban.role.repository.RoleRepository;
import com.kanban.role.service.RoleService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("RoleService")
@Transactional
public class RoleServiceImpl implements RoleService {

  private final RoleRepository roleRepository;
  private final RoleMapper roleMapper;
  private final JournalHelper journalHelper;

  public RoleServiceImpl(RoleRepository roleRepository,
                         RoleMapper roleMapper,
                         JournalHelper journalHelper) {
    this.roleRepository = roleRepository;
    this.roleMapper = roleMapper;
    this.journalHelper = journalHelper;
  }

  @Override
  @Transactional(readOnly = true)
  public List<RoleDto> getAllRole() {
    return roleRepository.findAll().stream().map(roleMapper::toDto).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<RoleDto> getRoleByCptId(String cptId) {
    return roleRepository.findByCptId(cptId).stream().map(roleMapper::toDto).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<RoleDto> getRoleByTabId(String tabId) {
    return roleRepository.findByTabId(tabId).stream().map(roleMapper::toDto).toList();
  }

  @Override
  public RoleDto associerRole(RoleDto roleDto) {
    if (roleRepository.existsByCptIdAndTabId(roleDto.getCptId(), roleDto.getTabId())) {
      throw new IllegalStateException(
              "Le compte " + roleDto.getCptId() + " a déjà un rôle sur ce tableau.");
    }
    Role role = roleMapper.toEntity(roleDto);
    Role saved = roleRepository.save(role);

    journalHelper.logTableau(
            "Ajout membre tableau",
            String.format("Le compte %s a été ajouté au tableau avec le rôle %s",
                    saved.getCptId(), saved.getRolRole()),
            null,
            JournalAction.ADD_MEMBER,
            saved.getTabId()
    );

    return roleMapper.toDto(saved);
  }

  @Override
  public void deleteRole(String cptId, String tabId) {
    RoleId id = new RoleId(cptId, tabId);
    if (!roleRepository.existsById(id)) {
      throw new EntityNotFoundException(
              "Association introuvable pour compte=" + cptId + " et le tableau=" + tabId);
    }
    roleRepository.deleteById(id);

    journalHelper.logTableau(
            "Retrait membre tableau",
            String.format("Le compte %s a été retiré du tableau", cptId),
            null,
            JournalAction.REMOVE_MEMBER,
            tabId
    );
  }

  @Override
  public RoleDto updateRole(String cptId, String tabId, String newRole) {
    RoleId id = new RoleId(cptId, tabId);
    Role role = roleRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    "Association introuvable pour compte=" + cptId + " et le tableau=" + tabId));

    String ancienRole = role.getRolRole();
    role.setRolRole(newRole);
    Role saved = roleRepository.save(role);

    journalHelper.logTableau(
            "Modification rôle membre",
            String.format("Le rôle du compte %s a changé de %s à %s dans le tableau",
                    cptId, ancienRole, newRole),
            null,
            JournalAction.UPDATE_BOARD,
            tabId
    );

    return roleMapper.toDto(saved);
  }
}