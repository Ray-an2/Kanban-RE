package com.kanban.associer.service;

import com.kanban.associer.dtos.AssocierDto;

import java.util.List;


public interface AssocierService {
  /**
   * Liste tous les associations
   * @return Liste<AssocierDto> : Liste des associations.
   */
  List<AssocierDto> getAllAssocier();

  /**
   * Récupère une association avec l'identifiant de la carte passé en paramètre
   * @param carId : identifiant de la carte
   * @return Liste<AssocierDto> : Liste des associations.
   */
  List<AssocierDto> getAssocierByCarId(String carId);

  /**
   * Récupère une association avec l'identifiant de l'etiquette passé en paramètre
   * @param carId : identifiant de l'etiquette
   * @return Liste<AssocierDto> : Liste des associations.
   */
  List<AssocierDto> getAssocierByEtiId(String etiId);

  /**
   * Crée une association entre une carte et une etiquette
   * @param associerDto
   * @return
   */
  AssocierDto createAssocier(AssocierDto associerDto);

  /**
   * Supprime une association entre une carte et une etiquette.
   * @param carId : identifiant de la carte
   * @param etiId : identifiant de l'etiquette
   * @return true si l'association est supprimée, false sinon
   */
  boolean deleteAssocier(String carId, String etiId);

}
