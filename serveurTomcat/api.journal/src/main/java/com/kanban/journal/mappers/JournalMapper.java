package com.kanban.journal.mappers;

import com.kanban.journal.dtos.JournalDto;
import com.kanban.journal.entity.Journal;
import org.springframework.stereotype.Component;

@Component
public class JournalMapper {

    public JournalDto toDto(Journal journal) {
        if (journal == null) return null;
        JournalDto dto = new JournalDto();
        dto.setId(journal.getId());
        dto.setTitre(journal.getTitre());
        dto.setDescription(journal.getDescription());
        dto.setAuteur(journal.getAuteur());
        dto.setAction(journal.getAction());
        dto.setDate(journal.getDate());
        dto.setEtat(journal.getEtat());
        dto.setTabId(journal.getTabId());
        dto.setCarId(journal.getCarId());
        return dto;
    }

    public Journal toEntity(JournalDto dto) {
        if (dto == null) return null;
        Journal journal = new Journal();
        if (dto.getId() != null) {
            journal.setId(dto.getId());
        }
        journal.setTitre(dto.getTitre());
        journal.setDescription(dto.getDescription());
        journal.setAuteur(dto.getAuteur());
        journal.setAction(dto.getAction());
        journal.setDate(dto.getDate());
        journal.setEtat(dto.getEtat());
        journal.setTabId(dto.getTabId());
        journal.setCarId(dto.getCarId());
        return journal;
    }
}