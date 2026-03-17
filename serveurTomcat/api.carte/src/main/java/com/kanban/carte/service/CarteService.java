package com.kanban.carte.service;

import com.kanban.carte.dtos.CarteDto;

import java.util.List;

import org.springframework.stereotype.Service;


public interface CarteService {
  List<CarteDto> getAllCartes();

  CarteDto getCarteById(Long id);

  CarteDto createCarte(CarteDto carteDto);

  boolean deleteCarte(Long id);
}
