package com.kanban.compte.mappers;

import com.kanban.compte.dtos.CompteDto;
import com.kanban.compte.entity.Compte;
import org.springframework.stereotype.Component;

@Component
public class CompteMapper {

  public CompteDto toDto(Compte compte) {
    if (compte == null) return null;
    CompteDto dto = new CompteDto();
    dto.setId(compte.getId());
    dto.setPseudo(compte.getPseudo());
    dto.setRole(compte.getRole());
    return dto;
  }

  public Compte toEntity(CompteDto dto) {
    if (dto == null) return null;
    Compte compte = new Compte();
    compte.setId(dto.getId());
    compte.setPseudo(dto.getPseudo());
    compte.setRole(dto.getRole());
    return compte;
  }
}