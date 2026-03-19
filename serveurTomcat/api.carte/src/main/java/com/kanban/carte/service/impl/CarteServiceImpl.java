package com.kanban.carte.service.impl;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.entity.Carte;
import com.kanban.carte.mappers.CarteMapper;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.carte.service.CarteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service("carteService")
@Transactional
public class CarteServiceImpl implements CarteService {

  private final CarteRepository carteRepository;
  private final CarteMapper carteMapper;

  public CarteServiceImpl(CarteRepository carteRepository, CarteMapper carteMapper) {
    this.carteRepository = carteRepository;
    this.carteMapper = carteMapper;
  }

  // -------------------------------------------------------------------------
  // CRUD de base
  // -------------------------------------------------------------------------

  @Override
  @Transactional(readOnly = true)
  public List<CarteDto> getAllCartes() {
    return carteRepository.findAll().stream()
            .map(carteMapper::toDto)
            .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public CarteDto getCarteById(String id) {
    return carteRepository.findById(id)
            .map(carteMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException(
                    "La carte avec l'id " + id + " n'existe pas"));
  }

  @Override
  public CarteDto createCarte(CarteDto carteDto) {
    Carte carte = carteMapper.toEntity(carteDto);
    carte.setId(UUID.randomUUID().toString());
    carte.setDateCreation(Instant.now().toString());
    if (carte.getArchiver() == null) carte.setArchiver("N");
    if (carte.getTerminer() == null) carte.setTerminer("N");
    if (carte.getOrdre() == null)    carte.setOrdre("0");
    if (carte.getPriorite() == null) carte.setPriorite(0);
    return carteMapper.toDto(carteRepository.save(carte));
  }

  @Override
  public CarteDto updateCarte(String id, CarteDto carteDto) {
    Carte carte = carteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    "La carte avec l'id " + id + " n'existe pas"));
    carte.setNom(carteDto.getNom());
    carte.setDescription(carteDto.getDescription());
    carte.setArchiver(carteDto.getArchiver());
    carte.setTerminer(carteDto.getTerminer());
    carte.setOrdre(carteDto.getOrdre());
    carte.setPriorite(carteDto.getPriorite());
    carte.setDateDebut(carteDto.getDateDebut());
    carte.setDateFin(carteDto.getDateFin());
    carte.setCouverture(carteDto.getCouverture());
    carte.setLisId(carteDto.getLisId());
    return carteMapper.toDto(carteRepository.save(carte));
  }

  @Override
  public boolean deleteCarte(String id) {
    if (!carteRepository.existsById(id)) {
      throw new EntityNotFoundException("La carte avec l'id " + id + " n'existe pas");
    }
    carteRepository.deleteById(id);
    return true;
  }

  // -------------------------------------------------------------------------
  // Déplacement
  // -------------------------------------------------------------------------

  /**
   * Déplace une carte vers une autre liste.
   */
  @Override
  public CarteDto moveCarteToList(String carId, String newLisId) {
    Carte carte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException(
                    "La carte avec l'id " + carId + " n'existe pas"));
    carte.setLisId(newLisId);
    return carteMapper.toDto(carteRepository.save(carte));
  }

  /**
   * Déplace une carte dans la même liste ou vers une autre liste
   * en mettant à jour son ordre et sa liste cible.
   */
  @Override
  public CarteDto moveCarteOrdre(String carId, String newLisId, Integer newOrdre) {
    Carte carte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException(
                    "La carte avec l'id " + carId + " n'existe pas"));
    carte.setLisId(newLisId);
    carte.setOrdre(String.valueOf(newOrdre));
    return carteMapper.toDto(carteRepository.save(carte));
  }

  // -------------------------------------------------------------------------
  // Statuts
  // -------------------------------------------------------------------------

  /**
   * Bascule l'état terminer de la carte (N → T ou T → N).
   */
  @Override
  public CarteDto terminer(String carId) {
    Carte carte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException(
                    "La carte avec l'id " + carId + " n'existe pas"));
    carte.setTerminer("T".equals(carte.getTerminer()) ? "N" : "T");
    return carteMapper.toDto(carteRepository.save(carte));
  }

  /**
   * Bascule l'état archiver de la carte (N → O ou O → N).
   */
  @Override
  public CarteDto archiver(String carId) {
    Carte carte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException(
                    "La carte avec l'id " + carId + " n'existe pas"));
    carte.setArchiver("O".equals(carte.getArchiver()) ? "N" : "O");
    return carteMapper.toDto(carteRepository.save(carte));
  }

  // -------------------------------------------------------------------------
  // Cartes archivées
  // -------------------------------------------------------------------------

  /**
   * Retourne toutes les cartes archivées d'un tableau.
   */
  @Override
  @Transactional(readOnly = true)
  public List<CarteDto> getCartesArchivees(String tabId) {
    return carteRepository.findArchiveesByTabId(tabId)
            .stream()
            .map(carteMapper::toDto)
            .toList();
  }

  // -------------------------------------------------------------------------
  // Comptage
  // -------------------------------------------------------------------------

  /**
   * Compte le nombre de cartes dans une liste.
   */
  @Override
  @Transactional(readOnly = true)
  public Long countByLisId(String lisId) {
    return carteRepository.countByLisId(lisId);
  }

  // -------------------------------------------------------------------------
  // Date limite
  // -------------------------------------------------------------------------

  /**
   * Retourne true si la date de fin de la carte est dépassée.
   */
  @Override
  @Transactional(readOnly = true)
  public Boolean isEnRetard(String carId) {
    String now = Instant.now().toString();
    Boolean result = carteRepository.isEnRetard(carId, now);
    return result != null && result;
  }
}