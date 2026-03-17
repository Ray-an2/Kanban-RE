package com.kanban.carte.service.impl;

import com.kanban.carte.repository.CarteRepository;
import com.kanban.carte.service.CarteService;
import com.kanban.carte.mappers.CarteMapper;
import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.entity.Carte;

import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implémentation des opérations métier pour la gestion des cartes.
 * Cette classe suit le principe de Single Responsibility (SOLID).
 */
@Service("carteService")
@Transactional
public class CarteServiceImpl implements CarteService {

  private final CarteRepository carteRepository;
  private final CarteMapper carteMapper;

  public CarteServiceImpl(CarteRepository carteRepository, CarteMapper carteMapper) {
    this.carteRepository = carteRepository;
    this.carteMapper = carteMapper;
  }

  @Override
  @Transactional(readOnly = true)
  public List<CarteDto> getAllCartes() {
    return carteRepository.findAll().stream()
        .map(carteMapper::toDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public CarteDto getCarteById(Long id) {
    var carte = carteRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(
            String.format("La carte avec l'Id %d n'existe pas", id)));
    return carteMapper.toDto(carte);
  }

  @Override
  public CarteDto createCarte(CarteDto carteDto) {
    var carte = carteMapper.toEntity(carteDto);
    var savedCarte = carteRepository.save(carte);
    return carteMapper.toDto(savedCarte);
  }

  @Override
  public boolean deleteCarte(Long id) {
    carteRepository.deleteById(id);
    return true;
  }
}