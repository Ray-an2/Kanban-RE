package com.kanban.tableau.repository;

import com.kanban.tableau.entity.Tableau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableauRepository extends JpaRepository<Tableau, String> {
}