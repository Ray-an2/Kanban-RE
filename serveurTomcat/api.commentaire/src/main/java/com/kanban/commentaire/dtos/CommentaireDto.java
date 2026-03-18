package com.kanban.commentaire.dtos;

import jakarta.persistence.Id;
import lombok.Data;

@Data
public class CommentaireDto {
    @Id
    private String id;
    private String carteId;
    private String auteurId;
    private String contenu;
    private String dateCreation;
}
