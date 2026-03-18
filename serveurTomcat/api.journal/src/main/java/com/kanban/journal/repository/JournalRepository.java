package com.kanban.journal.repository;

import com.kanban.journal.entity.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JournalRepository extends JpaRepository<Journal, String> {
    List<Journal> findByTabId(String tabId);
    List<Journal> findByCarId(String carId);
    List<Journal> findByEtat(String etat);
    Long countByTabId(String tabId);
    Optional<Journal> findFirstByTabIdOrderByDateDesc(String tabId);
}