package com.kanban.commentaire.mappers;

import com.kanban.commentaire.dtos.CommentaireDto;
import com.kanban.commentaire.entity.Commentaire;
import org.springframework.stereotype.Component;

@Component
public class CommentaireMapper {
    public CommentaireDto toDto(Commentaire commentaire) {
        if (commentaire == null) return null;
        CommentaireDto dto = new CommentaireDto();
        dto.setId(commentaire.getId());
        dto.setCarteId(commentaire.getCarteId());
        dto.setAuteurId(commentaire.getAuteurId());
        dto.setContenu(commentaire.getContenu());
        dto.setDateCreation(commentaire.getDateCreation());
        return dto;
    }

    public Commentaire toEntity(CommentaireDto dto) {
        if (dto == null) return null;
        Commentaire commentaire = new Commentaire();
        commentaire.setId(dto.getId());
        commentaire.setCarteId(dto.getCarteId());
        commentaire.setAuteurId(dto.getAuteurId());
        commentaire.setContenu(dto.getContenu());
        commentaire.setDateCreation(dto.getDateCreation());
        return commentaire;
    }
}
