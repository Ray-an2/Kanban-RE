package com.kanban.tableau.mappers;

import com.kanban.tableau.dtos.TableauDto;
import com.kanban.tableau.entity.Tableau;
import org.springframework.stereotype.Component;
import java.util.Objects;

@Component
public class TableauMapper {

  public TableauDto toDto(Tableau tab){
    if(tab == null) return null;
    TableauDto dto = new TableauDto();
    dto.setId(tab.getId());
    dto.setNom(tab.getNom());
    dto.setDescription(tab.getDescription());
    dto.setDate(tab.getDate());
    dto.setEtat(tab.getEtat());
    dto.setImage(tab.getImage());
    return dto;
  }

  public Tableau toEntity(TableauDto dto){
    if(dto == null) return null;
    Tableau tab = new Tableau();
    if (tableauDto.getId() != null) {
      tab.setId(dto.getId());
    }
    tab.setNom(dto.getNom());
    tab.setDescription(dto.getDescription());
    tab.setDate(dto.getDate());
    tab.setEtat(dto.getEtat());
    tab.setImage(dto.getImage());
    return tab;
  }
}
