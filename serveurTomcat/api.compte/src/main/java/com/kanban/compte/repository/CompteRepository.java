package com.kanban.compte.repository;

import com.kanban.compte.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, String> {

    // Vérifier si un pseudo est déjà utilisé
    boolean existsByPseudo(String pseudo);

    // Trouver un compte par son pseudo (utile pour des vérifications futures)
    Optional<Compte> findByPseudo(String pseudo);
}