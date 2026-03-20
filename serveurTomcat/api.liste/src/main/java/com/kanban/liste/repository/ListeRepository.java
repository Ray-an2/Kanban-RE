
package com.kanban.liste.repository;

import com.kanban.liste.entity.Liste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeRepository extends JpaRepository<Liste, String> {

    List<Liste> findByTabIdOrderByOrdre(String tabId);

    List<Liste> findByTabIdAndEtat(String tabId, String etat);

    List<Liste> findByTabId(String tabId);

    @Query("SELECT l FROM Liste l WHERE l.tabId = :tabId AND LOWER(l.titre) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Liste> searchByTitreInTab(@Param("tabId") String tabId, @Param("search") String search);
}