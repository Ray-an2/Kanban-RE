package com.kanban.tableau.repository;

import com.kanban.tableau.entity.Tableau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableauRepository extends JpaRepository<Tableau, String> {

    // Tableaux d'un utilisateur (via rôle)
    @Query("SELECT t FROM Tableau t JOIN Role r ON t.id = r.id.tabId WHERE r.id.cptId = :cptId AND r.rolRole != 'E'")
    List<Tableau> findByCompteId(@Param("cptId") String cptId);

    // Recherche par nom (insensible à la casse)
    @Query("SELECT t FROM Tableau t WHERE LOWER(t.nom) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Tableau> findByNomContaining(@Param("search") String search);

    // Tri par date décroissante
    List<Tableau> findAllByOrderByDateDesc();

    // Tri alphabétique
    List<Tableau> findAllByOrderByNomAsc();

    // Tableaux d'un utilisateur triés par date
    @Query("SELECT t FROM Tableau t JOIN Role r ON t.id = r.id.tabId WHERE r.id.cptId = :cptId AND r.rolRole != 'E' ORDER BY t.date DESC")
    List<Tableau> findByCompteIdOrderByDateDesc(@Param("cptId") String cptId);

    // Tableaux d'un utilisateur triés par nom
    @Query("SELECT t FROM Tableau t JOIN Role r ON t.id = r.id.tabId WHERE r.id.cptId = :cptId AND r.rolRole != 'E' ORDER BY t.nom ASC")
    List<Tableau> findByCompteIdOrderByNomAsc(@Param("cptId") String cptId);
}