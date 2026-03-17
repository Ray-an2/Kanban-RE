package com.kanban.carte.mappers;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.entity.Carte;
import org.springframework.stereotype.Component;

@Component
public class CarteMapper {

  public CarteDto toDto(Carte carte) {
    if (carte == null) return null;
    CarteDto dto = new CarteDto();
    dto.setId(carte.getId());
    dto.setNom(carte.getNom());
    dto.setDescription(carte.getDescription());
    dto.setArchiver(carte.getArchiver());
    dto.setTerminer(carte.getTerminer());
    dto.setOrdre(carte.getOrdre());
    dto.setPriorite(carte.getPriorite());
    dto.setDateCreation(carte.getDateCreation());
    dto.setDateDebut(carte.getDateDebut());
    dto.setDateFin(carte.getDateFin());
    dto.setCouverture(carte.getCouverture());
    dto.setLisId(carte.getLisId());
    return dto;
  }

  public Carte toEntity(CarteDto dto) {
    if (dto == null) return null;
    Carte carte = new Carte();
    if (dto.getId() != null) {
      carte.setId(dto.getId());
    }
    carte.setNom(dto.getNom());
    carte.setDescription(dto.getDescription());
    carte.setArchiver(dto.getArchiver());
    carte.setTerminer(dto.getTerminer());
    carte.setOrdre(dto.getOrdre());
    carte.setPriorite(dto.getPriorite());
    carte.setDateCreation(dto.getDateCreation());
    carte.setDateDebut(dto.getDateDebut());
    carte.setDateFin(dto.getDateFin());
    carte.setCouverture(dto.getCouverture());
    carte.setLisId(dto.getLisId());
    return carte;
  }
}