package com.kanban.liste.mappers;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.carte.mappers.CarteMapper;
import com.kanban.liste.dtos.ListeDto;
import com.kanban.liste.entity.Liste;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ListeMapper {

    private final CarteRepository carteRepository;
    private final CarteMapper carteMapper;

    public ListeMapper(CarteRepository carteRepository, CarteMapper carteMapper) {
        this.carteRepository = carteRepository;
        this.carteMapper = carteMapper;
    }

    public ListeDto toDto(Liste liste) {
        if (liste == null) return null;

        ListeDto dto = new ListeDto();
        dto.setId(liste.getId());
        dto.setTitre(liste.getTitre());
        dto.setOrdre(liste.getOrdre());
        dto.setEtat(liste.getEtat());
        dto.setTabId(liste.getTabId());

        // Récupération des cartes associées
        List<CarteDto> cartes = carteRepository.findByLisId(liste.getId())
                .stream().map(carteMapper::toDto).toList();
        dto.setCartes(cartes);

        return dto;
    }

    public Liste toEntity(ListeDto dto) {
        if (dto == null) return null;

        Liste liste = new Liste();
        liste.setId(dto.getId());
        liste.setTitre(dto.getTitre());
        liste.setOrdre(dto.getOrdre());
        liste.setEtat(dto.getEtat());
        liste.setTabId(dto.getTabId());
        return liste;
    }
}