package com.kanban.tableau.repository;

import com.kanban.tableau.entity.Tableau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableauRepository extends JpaRepository<Tableau, String> {

    @Query("SELECT t FROM Tableau t JOIN Role r ON t.id = r.id.tabId WHERE r.id.cptId = :cptId AND r.rolRole != 'P'")
    List<Tableau> findByCompteId(@Param("cptId") String cptId);
}