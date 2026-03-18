package com.kanban.document.service.impl;

import com.kanban.document.dtos.DocumentDto;
import com.kanban.document.mappers.DocumentMapper;
import com.kanban.document.repository.DocumentRepository;
import com.kanban.document.service.DocumentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service("documentService")
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;

    public DocumentServiceImpl(DocumentRepository documentRepository, DocumentMapper documentMapper) {
        this.documentRepository = documentRepository;
        this.documentMapper = documentMapper;
    }

    @Override
    public List<DocumentDto> getAllDocuments() {
        return documentRepository.findAll().stream()
                .map(documentMapper::toDto)
                .toList();
    }

    @Override
    public List<DocumentDto> getDocumentsByCarteId(String carteId) {
        return documentRepository.findByCarteId(carteId).stream()
                .map(documentMapper::toDto)
                .toList();
    }

    @Override
    public DocumentDto getDocumentById(String id) {
        return documentRepository.findById(id)
                .map(documentMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Le document avec l'id %s n'existe pas", id)));
    }

    @Override
    public DocumentDto createDocument(DocumentDto documentDto) {
        var document = documentMapper.toEntity(documentDto);
        document.setId(UUID.randomUUID().toString());
        if (document.getDateCreation() == null || document.getDateCreation().isBlank()) {
            document.setDateCreation(Instant.now().toString());
        }
        return documentMapper.toDto(documentRepository.save(document));
    }

    @Override
    public DocumentDto updateDocument(String id, DocumentDto documentDto) {
        var document = documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Le document avec l'id %s n'existe pas", id)));
        document.setCarteId(documentDto.getCarteId());
        document.setNomFichier(documentDto.getNomFichier());
        document.setUrl(documentDto.getUrl());
        return documentMapper.toDto(documentRepository.save(document));
    }

    @Override
    public boolean deleteDocument(String id) {
        documentRepository.deleteById(id);
        return true;
    }
}
