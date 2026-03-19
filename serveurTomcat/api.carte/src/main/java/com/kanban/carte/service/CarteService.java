package com.kanban.carte.service;

import com.kanban.carte.dtos.CarteDto;

import java.util.List;

public interface CarteService {

  // --- CRUD de base ---
  List<CarteDto> getAllCartes();
  CarteDto getCarteById(String id);
  CarteDto createCarte(CarteDto carteDto);
  CarteDto updateCarte(String id, CarteDto carteDto);
  boolean deleteCarte(String id);

  // --- Déplacement ---
  CarteDto moveCarteToList(String carId, String newLisId);
  CarteDto moveCarteOrdre(String carId, String newLisId, Integer newOrdre);

  // --- Statuts ---
  CarteDto terminer(String carId);
  CarteDto archiver(String carId);

  // --- Archivées ---
  List<CarteDto> getCartesArchivees(String tabId);

  // --- Comptage ---
  Long countByLisId(String lisId);

  // --- Date limite ---
  Boolean isEnRetard(String carId);
}