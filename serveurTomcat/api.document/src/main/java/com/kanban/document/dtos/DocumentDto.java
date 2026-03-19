package com.kanban.document.dtos;

import lombok.Data;


@Data
public class DocumentDto {
    private String id;
    private String carteId;
    private String nomFichier;
    private String url;
    private String dateCreation;
}