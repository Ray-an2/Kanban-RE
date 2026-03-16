package com.kanban.tableau.repository;

import com.kanban.tableau.entities.Tableau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableauRepository extends JpaRepository<Tableau, Long> {
}