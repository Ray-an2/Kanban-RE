package com.kanban.carte.service;

import com.kanban.carte.dtos.CarteDto;

import java.util.List;

public interface CarteService {

  List<CarteDto> getAllCartes();
  CarteDto getCarteById(String id);
  CarteDto createCarte(CarteDto carteDto);
  CarteDto updateCarte(String id, CarteDto carteDto);
  boolean deleteCarte(String id);

  CarteDto moveCarteToList(String carId, String newLisId);
  CarteDto moveCarteOrdre(String carId, String newLisId, Integer newOrdre);

  CarteDto terminer(String carId);
  CarteDto archiver(String carId);

  List<CarteDto> getCartesArchivees(String tabId);

  Long countByLisId(String lisId);

  Boolean isEnRetard(String carId);
}