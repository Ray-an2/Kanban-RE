package com.kanban.commentaire.repository;

import com.kanban.commentaire.entity.Commentaire;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentaireRepository extends MongoRepository<Commentaire, String> {
    List<Commentaire> findByCarteId(String carteId);
}
