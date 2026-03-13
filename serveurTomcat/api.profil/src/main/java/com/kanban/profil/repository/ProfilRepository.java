package com.kanban.profil.repository;

import com.kanban.profil.model.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProfilRepository extends JpaRepository<Profil, Long> {
}
