package com.kanban.carte.repository;

import com.kanban.carte.entity.Carte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarteRepository extends JpaRepository<Carte, String> {
    List<Carte> findByLisId(String lisId);
}