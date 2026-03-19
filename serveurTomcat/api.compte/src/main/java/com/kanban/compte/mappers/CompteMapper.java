package com.kanban.compte.mappers;

import com.kanban.compte.dtos.CompteCreateDto;
import com.kanban.compte.dtos.CompteDto;
import com.kanban.compte.entity.Compte;
import org.springframework.stereotype.Component;

@Component
public class CompteMapper {

  /**
   * Entité → DTO public (sans mot de passe).
   */
  public CompteDto toDto(Compte compte) {
    if (compte == null) return null;
    CompteDto dto = new CompteDto();
    dto.setId(compte.getId());
    dto.setPseudo(compte.getPseudo());
    dto.setRole(compte.getRole());
    return dto;
  }

  /**
   * DTO public → entité (sans mot de passe, utilisé pour les mises à jour).
   */
  public Compte toEntity(CompteDto dto) {
    if (dto == null) return null;
    Compte compte = new Compte();
    if (dto.getId() != null) compte.setId(dto.getId());
    compte.setPseudo(dto.getPseudo());
    compte.setRole(dto.getRole());
    return compte;
  }

  /**
   * DTO de création → entité (avec mot de passe haché).
   */
  public Compte toEntityFromCreate(CompteCreateDto dto) {
    if (dto == null) return null;
    Compte compte = new Compte();
    compte.setPseudo(dto.getPseudo());
    compte.setMdp(dto.getMdp());
    compte.setRole(dto.getRole() != null ? dto.getRole() : "U");
    return compte;
  }
}