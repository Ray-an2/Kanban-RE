package com.kanban.commentaire.service.impl;

import com.kanban.commentaire.dtos.CommentaireDto;
import com.kanban.commentaire.mappers.CommentaireMapper;
import com.kanban.commentaire.repository.CommentaireRepository;
import com.kanban.commentaire.service.CommentaireService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service("commentaireService")
public class CommentaireServiceImpl implements CommentaireService {

    private final CommentaireRepository commentaireRepository;
    private final CommentaireMapper commentaireMapper;

    public CommentaireServiceImpl(CommentaireRepository commentaireRepository, CommentaireMapper commentaireMapper) {
        this.commentaireRepository = commentaireRepository;
        this.commentaireMapper = commentaireMapper;
    }

    @Override
    public List<CommentaireDto> getAllCommentaires() {
        return commentaireRepository.findAll().stream()
                .map(commentaireMapper::toDto)
                .toList();
    }

    @Override
    public List<CommentaireDto> getCommentairesByCarteId(String carteId) {
        return commentaireRepository.findByCarteId(carteId).stream()
                .map(commentaireMapper::toDto)
                .toList();
    }

    @Override
    public CommentaireDto getCommentaireById(String id) {
        return commentaireRepository.findById(id)
                .map(commentaireMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Le commentaire avec l'id %s n'existe pas", id)));
    }

    @Override
    public CommentaireDto createCommentaire(CommentaireDto commentaireDto) {
        var commentaire = commentaireMapper.toEntity(commentaireDto);
        commentaire.setId(UUID.randomUUID().toString());
        String now = Instant.now().toString();
        if (commentaire.getDateCreation() == null || commentaire.getDateCreation().isBlank()) {
            commentaire.setDateCreation(now);
        }
        return commentaireMapper.toDto(commentaireRepository.save(commentaire));
    }

    @Override
    public boolean deleteCommentaire(String id) {
        commentaireRepository.deleteById(id);
        return true;
    }
}
