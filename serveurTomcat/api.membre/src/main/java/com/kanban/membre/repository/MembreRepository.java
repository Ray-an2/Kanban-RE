package com.kanban.membre.repository;

import com.kanban.membre.entity.Membre;
import com.kanban.role.entity.Associer;
import com.kanban.role.entity.AssocierId;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembreRepository extends JpaRepository<Associer, AssocierId>  {

    List<Membre> findByCarId(String carId);

    boolean existsByCptIdAndCarId(String cptId, String carId);
}
