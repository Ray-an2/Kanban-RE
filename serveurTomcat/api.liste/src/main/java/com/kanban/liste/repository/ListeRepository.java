package com.kanban.liste.repository;

import com.kanban.liste.entity.Liste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeRepository extends JpaRepository<Liste, String> {
    List<Liste> findByTabIdOrderByOrdre(String tabId);
}