
package com.kanban.liste.repository;

import com.kanban.liste.entity.Liste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeRepository extends JpaRepository<Liste, String> {

    // Listes publiées d'un tableau, triées par ordre
    List<Liste> findByTabIdOrderByOrdre(String tabId);

    // Listes archivées d'un tableau
    List<Liste> findByTabIdAndEtat(String tabId, String etat);

    // Listes d'un tableau quel que soit l'état
    List<Liste> findByTabId(String tabId);

    // Rechercher les listes dont le titre contient un mot-clé
    @Query("SELECT l FROM Liste l WHERE l.tabId = :tabId AND LOWER(l.titre) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Liste> searchByTitreInTab(@Param("tabId") String tabId, @Param("search") String search);
}