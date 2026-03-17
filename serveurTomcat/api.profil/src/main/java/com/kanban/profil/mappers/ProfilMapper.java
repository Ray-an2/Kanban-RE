package com.kanban.profil.mappers;

import com.kanban.profil.dtos.ProfilDto;
import com.kanban.profil.entity.Profil;
import org.springframework.stereotype.Component;

@Component
public class ProfilMapper {

  public ProfilDto toDto(Profil profil) {
    if (profil == null) return null;
    ProfilDto dto = new ProfilDto();
    dto.setCompteId(profil.getCompteId());
    dto.setNom(profil.getNom());
    dto.setPrenom(profil.getPrenom());
    dto.setMail(profil.getMail());
    dto.setEtat(profil.getEtat());
    dto.setDateCreation(profil.getDateCreation());
    return dto;
  }

  public Profil toEntity(ProfilDto dto) {
    if (dto == null) return null;
    Profil profil = new Profil();
    if (dto.getCompteId() != null) {
      profil.setCompteId(dto.getCompteId());
    }
    profil.setNom(dto.getNom());
    profil.setPrenom(dto.getPrenom());
    profil.setMail(dto.getMail());
    profil.setEtat(dto.getEtat());
    profil.setDateCreation(dto.getDateCreation());
    return profil;
  }
}