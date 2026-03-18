package com.kanban.document.service;

import com.kanban.document.dtos.DocumentDto;

import java.util.List;

public interface DocumentService {
    List<DocumentDto> getAllDocuments();
    List<DocumentDto> getDocumentsByCarteId(String carteId);
    DocumentDto getDocumentById(String id);
    DocumentDto createDocument(DocumentDto documentDto);
    DocumentDto updateDocument(String id, DocumentDto documentDto);
    boolean deleteDocument(String id);
}
