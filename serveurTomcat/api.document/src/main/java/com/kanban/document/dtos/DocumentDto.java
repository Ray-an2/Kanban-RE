package com.kanban.document.dtos;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class DocumentDto {
    @Id
    private String id;
    private String carteId;
    private String nomFichier;
    private String url;
    private String dateCreation;
}
