package com.kanban.associer.repository;

import com.kanban.associer.entity.Associer;
import com.kanban.associer.entity.AssocierId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssocierRepository extends JpaRepository<Associer, AssocierId> {

  List<Associer> findByCarId(String cptId);

  List<Associer> findByEtiId(String etiId);

  boolean existsByCarIdAndEtiId(String carId, String etiId);
}
