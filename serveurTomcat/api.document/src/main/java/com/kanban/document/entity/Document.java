package com.kanban.document.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@org.springframework.data.mongodb.core.mapping.Document(collection = "documents")
public class Document {
    @Id
    private String id;
    private String carteId;
    private String nomFichier;
    private String url;
    private String dateCreation;
}
