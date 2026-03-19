package com.kanban.commentaire.dtos;

import lombok.Data;

@Data
public class CommentaireDto {
    private String id;
    private String carteId;
    private String auteurId;
    private String contenu;
    private String dateCreation;
}