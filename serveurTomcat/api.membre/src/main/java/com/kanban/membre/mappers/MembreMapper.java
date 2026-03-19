package com.kanban.membre.mappers;

import com.kanban.membre.dtos.MembreDto;
import com.kanban.membre.entity.Membre;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class MembreMapper {

    public MembreDto toDto(Membre membre) {
        if (membre == null) return null;
        MembreDto dto = new MembreDto();
        dto.setCptId(membre.getCptId());
        dto.setCarId(membre.getCarId());
        dto.setDateCreation(membre.getDateCreation());
        return dto;
    }

    public Membre toEntity(MembreDto dto) {
        if (dto == null) return null;
        Membre membre = new Membre();
        membre.setCptId(dto.getCptId());
        membre.setCarId(dto.getCarId());
        membre.setDateCreation(
                dto.getDateCreation() != null && !dto.getDateCreation().isBlank()
                        ? dto.getDateCreation()
                        : Instant.now().toString()
        );
        return membre;
    }
}