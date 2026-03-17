package com.kanban.carte.mappers;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.entity.Carte;
import org.springframework.stereotype.Component;

@Component
public class CarteMapper {

  public CarteDto toDto(Carte carte){
    if (carte == null){
      return null;
    }
    CarteDto carteDto = new CarteDto();
    carteDto.setId(carte.getId());
    carteDto.setNom(carte.getNom());
    carteDto.setDescription(carte.getDescription());
    carteDto.setArchiver(carte.getArchiver());
    carteDto.setTerminer(carte.getTerminer());
    carteDto.setOrdre(carte.getOrdre());
    carteDto.setPriorite(carte.getPriorite());
    carteDto.setDateDebut(carte.getDateDebut());
    carteDto.setDateFin(carte.getDateFin());
    carteDto.setImage(carte.getImage());
    return carteDto;
  }

  public Carte toEntity(CarteDto carteDto){
    if (carteDto == null){
      return null;
    }
    Carte carte = new Carte();
    if(carteDto.getId() !=null){
      carte.setId(carteDto.getId());
    }
    carte.setNom(carteDto.getNom());
    carte.setDescription(carteDto.getDescription());
    carte.setArchiver(carteDto.getArchiver());
    carte.setTerminer(carteDto.getTerminer());
    carte.setOrdre(carteDto.getOrdre());
    carte.setPriorite(carteDto.getPriorite());
    carte.setDateDebut(carteDto.getDateDebut());
    carte.setDateFin(carteDto.getDateFin());
    carte.setImage(carteDto.getImage());
    return carte;
  }
}
