package com.kanban.membre.mappers;

import com.kanban.membre.dtos.MembreDto;
import com.kanban.membre.entity.Membre;
import org.springframework.stereotype.Component;

public class MembreMapper {
    public MembreDto toDto(Membre membre){
        if (membre == null) {
            return null;
        }
        MembreDto membreDto = new MembreDto();
        membreDto.setCptId(membre.getCptId());
        membreDto.setCarId(membre.getCarId());
        if(membre.getCompte() != null){
            membreDto.getCptPseudo(membre.getCompte().getCptPseudo());
        }

        if(membre.getCarte() != null){
            membreDto.getCarNom(membre.getCarte().getCarNom());
        }
        return membreDto;
    }

    public Membre toEntity(MembreDto membreDto){
        if(membreDto == null){
            return null;
        }
        Membre membre = new Membre();
        membre.setCptId(membreDto.getCptId());
        membre.setCarId(membreDto.getCarId());
        return membre;
    }
}
