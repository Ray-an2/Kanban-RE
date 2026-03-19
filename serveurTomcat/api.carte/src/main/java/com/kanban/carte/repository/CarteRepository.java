package com.kanban.carte.repository;

import com.kanban.carte.entity.Carte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarteRepository extends JpaRepository<Carte, String> {

    // Cartes d'une liste
    List<Carte> findByLisId(String lisId);

    // Cartes archivées d'un tableau entier (via jointure liste)
    @Query("SELECT c FROM Carte c JOIN Liste l ON c.lisId = l.id WHERE l.tabId = :tabId AND c.archiver = 'O'")
    List<Carte> findArchiveesByTabId(@Param("tabId") String tabId);

    // Compter les cartes d'une liste
    Long countByLisId(String lisId);

    // Vérifier si une carte est en retard (date de fin dépassée)
    @Query("SELECT CASE WHEN c.dateFin IS NOT NULL AND c.dateFin < :now THEN true ELSE false END " +
            "FROM Carte c WHERE c.id = :carId")
    Boolean isEnRetard(@Param("carId") String carId, @Param("now") String now);

    // Cartes d'une liste triées par ordre
    List<Carte> findByLisIdOrderByOrdre(String lisId);
}