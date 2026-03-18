package com.kanban.document.controller;

import com.kanban.document.dtos.DocumentDto;
import com.kanban.document.service.impl.DocumentServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/document")
public class DocumentController {

    private final DocumentServiceImpl documentService;

    public DocumentController(DocumentServiceImpl documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public List<DocumentDto> getDocuments(@RequestParam(required = false) String carteId) {
        if (carteId != null && !carteId.isBlank()) {
            return documentService.getDocumentsByCarteId(carteId);
        }
        return documentService.getAllDocuments();
    }

    @GetMapping("/{docId}")
    public DocumentDto getDocument(@PathVariable String docId) {
        return documentService.getDocumentById(docId);
    }

    @PostMapping
    public DocumentDto createDocument(@RequestBody DocumentDto documentDto) {
        return documentService.createDocument(documentDto);
    }

    @PutMapping("/{docId}")
    public DocumentDto updateDocument(@PathVariable String docId, @RequestBody DocumentDto documentDto) {
        return documentService.updateDocument(docId, documentDto);
    }

    @DeleteMapping("/{docId}")
    public boolean deleteDocument(@PathVariable String docId) {
        return documentService.deleteDocument(docId);
    }
}
