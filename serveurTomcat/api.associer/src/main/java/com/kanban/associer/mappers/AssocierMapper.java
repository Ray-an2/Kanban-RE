package com.kanban.associer.mappers;

import com.kanban.associer.dtos.AssocierDto;
import com.kanban.associer.entity.Associer;
import org.springframework.stereotype.Component;

@Component
public class AssocierMapper {
  public AssocierDto toDto(Associer associer){
    if(associer==null){
      return null;
    }
    AssocierDto associerDto = new AssocierDto();
    associerDto.setCarId(associer.getCarId());
    associerDto.setEtiId(associer.getEtiId());
    if(associer.getCarte() != null) {
      associerDto.getCarNom(associer.getCarte().getCarNom());
    }
    if(associer.getEtiquette() != null) {
      associerDto.getEtiNom(associer.getEtiquette().getEtiNom());
    }
    return associerDto;
  }

  public Associer toEntity(AssocierDto associerDto){
    if(associerDto==null){
      return null;
    }
    Associer associer = new Associer();
    associer.setCarId(associerDto.getCarId());
    associer.setEtiId(associerDto.getEtiId());
    return associer;
  }
}
