package com.kanban.etiquette.mappers;

import com.kanban.etiquette.dtos.EtiquetteDto;
import com.kanban.etiquette.entity.Etiquette;
import org.springframework.stereotype.Component;

@Component
public class EtiquetteMapper {

    public EtiquetteDto toDto(Etiquette etiquette) {
        if (etiquette == null) return null;

        EtiquetteDto dto = new EtiquetteDto();
        dto.setId(etiquette.getId());
        dto.setNom(etiquette.getNom());
        dto.setCouleur(etiquette.getCouleur());
        return dto;
    }

    public Etiquette toEntity(EtiquetteDto dto) {
        if (dto == null) return null;

        Etiquette etiquette = new Etiquette();
        etiquette.setId(dto.getId());
        etiquette.setNom(dto.getNom());
        etiquette.setCouleur(dto.getCouleur());
        return etiquette;
    }
}