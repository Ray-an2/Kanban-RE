package com.kanban.compte.mappers;

import com.kanban.compte.dtos.CompteDto;
import com.kanban.compte.entity.Compte;

@Component
public class CompteMapper {

  public CompteDto toDto(Compte compte) {
    if (compte == null) {
      return null;
    }
    CompteDto compteDto = new CompteDto();
    compteDto.setId(compte.getId());
    compteDto.setPseudo(compte.getPseudo());
    compteDto.setRole(compte.getRole());
    return compteDto;
  }

  public Compte toEntity(CompteDto compteDto) {
    if (compteDto == null) {
      return null;
    }
    Compte compte = new Compte();
    compte.setId(compteDto.getId());
    compte.setPseudo(compteDto.getPseudo());
    compte.setRole(compteDto.getRole());
    return compte;
  }
}
