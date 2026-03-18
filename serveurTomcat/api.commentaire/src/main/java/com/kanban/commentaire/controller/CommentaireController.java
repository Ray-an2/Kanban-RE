package com.kanban.commentaire.controller;

import com.kanban.commentaire.dtos.CommentaireDto;
import com.kanban.commentaire.service.impl.CommentaireServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commentaire")
public class CommentaireController {

    private final CommentaireServiceImpl commentaireService;

    public CommentaireController(CommentaireServiceImpl commentaireService) {
        this.commentaireService = commentaireService;
    }

    @GetMapping
    public List<CommentaireDto> getCommentaires(@RequestParam(required = false) String carteId) {
        if (carteId != null && !carteId.isBlank()) {
            return commentaireService.getCommentairesByCarteId(carteId);
        }
        return commentaireService.getAllCommentaires();
    }

    @GetMapping("/{comId}")
    public CommentaireDto getCommentaire(@PathVariable String comId) {
        return commentaireService.getCommentaireById(comId);
    }

    @PostMapping
    public CommentaireDto createCommentaire(@RequestBody CommentaireDto commentaireDto) {
        return commentaireService.createCommentaire(commentaireDto);
    }

    @DeleteMapping("/{comId}")
    public boolean deleteCommentaire(@PathVariable String comId) {
        return commentaireService.deleteCommentaire(comId);
    }
}
