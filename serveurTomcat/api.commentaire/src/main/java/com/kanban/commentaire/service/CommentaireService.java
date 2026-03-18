package com.kanban.commentaire.service;

import com.kanban.commentaire.dtos.CommentaireDto;

import java.util.List;

public interface CommentaireService {
    List<CommentaireDto> getAllCommentaires();
    List<CommentaireDto> getCommentairesByCarteId(String carteId);
    CommentaireDto getCommentaireById(String id);
    CommentaireDto createCommentaire(CommentaireDto commentaireDto);
    boolean deleteCommentaire(String id);
}
