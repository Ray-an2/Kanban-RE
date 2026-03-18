package com.kanban.document.mappers;

import com.kanban.document.dtos.DocumentDto;
import com.kanban.document.entity.Document;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {
    public DocumentDto toDto(Document document) {
        if (document == null) return null;
        DocumentDto dto = new DocumentDto();
        dto.setId(document.getId());
        dto.setCarteId(document.getCarteId());
        dto.setNomFichier(document.getNomFichier());
        dto.setUrl(document.getUrl());
        dto.setDateCreation(document.getDateCreation());
        return dto;
    }

    public Document toEntity(DocumentDto dto) {
        if (dto == null) return null;
        Document document = new Document();
        document.setId(dto.getId());
        document.setCarteId(dto.getCarteId());
        document.setNomFichier(dto.getNomFichier());
        document.setUrl(dto.getUrl());
        document.setDateCreation(dto.getDateCreation());
        return document;
    }
}
