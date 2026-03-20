package com.kanban.associer.repository;

import com.kanban.associer.entity.Associer;
import com.kanban.associer.entity.AssocierId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssocierRepository extends JpaRepository<Associer, AssocierId> {

  /**
   * Trouve une carte avec son identifiant en paramètre.
   * @param carId : identifiant de la carte.
   * @return List<Associer> : Liste de liaisons entre la carte et les etiquettes.
   */
  List<Associer> findByCarId(String carId);

  /**
   * Trouve une etiquette avec son identifiant en paramètre.
   * @param carId : identifiant de l'etiquette.
   * @return List<Associer> : Liste de liaisons entre la carte et les etiquettes.
   */
  List<Associer> findByEtiId(String etiId);

  /**
   * Vérifie l'existence d'une association entre une carte et une etiquette.
   * @param carId : identifiant de la carte
   * @param etiId : identifiant de l'etiquette
   * @return true si l'association existe, false sinon
   */
  boolean existsByCarIdAndEtiId(String carId, String etiId);
}
