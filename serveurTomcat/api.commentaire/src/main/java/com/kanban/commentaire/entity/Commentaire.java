package com.kanban.commentaire.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "comments")
public class Commentaire {
    @Id
    private String id;
    private String carteId;
    private String auteurId;
    private String contenu;
    private String dateCreation;
}
