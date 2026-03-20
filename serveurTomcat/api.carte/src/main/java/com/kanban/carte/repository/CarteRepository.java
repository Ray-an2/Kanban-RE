package com.kanban.carte.repository;

import com.kanban.carte.entity.Carte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarteRepository extends JpaRepository<Carte, String> {

    List<Carte> findByLisId(String lisId);

    @Query("SELECT c FROM Carte c JOIN Liste l ON c.lisId = l.id WHERE l.tabId = :tabId AND c.archiver = 'O'")
    List<Carte> findArchiveesByTabId(@Param("tabId") String tabId);

    Long countByLisId(String lisId);

    @Query("SELECT CASE WHEN c.dateFin IS NOT NULL AND c.dateFin < :now THEN true ELSE false END " +
            "FROM Carte c WHERE c.id = :carId")
    Boolean isEnRetard(@Param("carId") String carId, @Param("now") String now);

    List<Carte> findByLisIdOrderByOrdre(String lisId);
}